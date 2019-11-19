terraform {
  required_version = ">= 0.11.1"

  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
    key            = "build-state/preview.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
    bucket = "wellcomecollection-infra"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

data "terraform_remote_state" "router" {
  backend = "s3"

  config {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
    bucket = "wellcomecollection-infra"
    key    = "build-state/router.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "us-east-1"
  alias   = "routemaster"

  assume_role {
    role_arn = "arn:aws:iam::250790015188:role/wellcomecollection-assume_role_hosted_zone_update"
  }
}
