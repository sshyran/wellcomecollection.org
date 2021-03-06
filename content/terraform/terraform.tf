terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/content.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 1.10"
  region  = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 1.10"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "random" {
  version = "~> 1.1"
}

provider "template" {
  version = "~> 1.0"
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config {
    bucket   = "wellcomecollection-infra"
    key      = "terraform.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

data "terraform_remote_state" "router" {
  backend = "s3"

  config {
    bucket   = "wellcomecollection-infra"
    key      = "build-state/router.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

locals {
  vpc_id                     = "${data.terraform_remote_state.infra.vpc_id}"
  vpc_subnets                = "${data.terraform_remote_state.infra.vpc_subnets}"
  loadbalancer_cloudwatch_id = "${data.terraform_remote_state.router.alb_id}"
  alb_listener_https_arn     = "${data.terraform_remote_state.router.alb_listener_https_arn}"
  alb_listener_http_arn      = "${data.terraform_remote_state.router.alb_listener_http_arn}"
  cluster_name               = "${data.terraform_remote_state.router.cluster_name}"
}

variable "dotdigital_password" {}
variable "dotdigital_username" {}


module "alb_server_error_alarm" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v7.0.1"
  name   = "alb_server_error_alarm"
}

module "alb_client_error_alarm" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v7.0.1"
  name   = "alb_client_error_alarm"
}

variable "container_tag" {}

module "content" {
  source     = "git::https://github.com/wellcometrust/terraform.git//ecs/service?ref=v7.0.1"
  name       = "content"
  cluster_id = "${local.cluster_name}"

  vpc_id = "${local.vpc_id}"

  nginx_uri                          = "wellcome/nginx_webapp:latest"
  app_uri                            = "wellcome/content_webapp:${var.container_tag}"
  listener_https_arn                 = "${local.alb_listener_https_arn}"
  listener_http_arn                  = "${local.alb_listener_http_arn}"
  server_error_alarm_topic_arn       = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn       = "${module.alb_client_error_alarm.arn}"
  loadbalancer_cloudwatch_id         = "${local.loadbalancer_cloudwatch_id}"
  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"
  desired_count                      = 2

  env_vars_length = 2
  env_vars = {
    dotdigital_username = "${var.dotdigital_username}",
    dotdigital_password = "${var.dotdigital_password}"
  }


  # CPU: (1024/2) - 128
  # Mem: (2000/2) - 128
  cpu = "384"

  memory                   = "872"
  primary_container_port   = "80"
  secondary_container_port = "3000"
  healthcheck_path         = "/content/management/healthcheck"

  # The content listener is the last listener to deal with things like vanity
  # URLs and 404 pages. We could create a service that deals with this, but there seems
  # little gain at the moment
  path_pattern = "/*"

  # This is the highest number, thus lower priority
  alb_priority = "50000"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source                 = "../../terraform-modules/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn  = "${local.alb_listener_http_arn}"
  target_group_arn       = "${module.content.target_group_arn}"
  priority               = "49999"
  values                 = ["content.wellcomecollection.org"]
}
