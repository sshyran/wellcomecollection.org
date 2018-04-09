module "pa11y_dashboard" {
  source        = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.4"
  name          = "pa11y_dashboard"
  cluster_id    = "${local.cluster_name}"
  task_role_arn = "${module.ecs_pa11y_dashboard_iam.task_role_arn}"
  template_name = "default"
  vpc_id        = "${local.vpc_id}"
  nginx_uri     = "wellcome/nginx_webapp:latest"
  app_uri       = "wellcome/pa11y_dashboard"

  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "200"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"

  # These account for the 128 mem and CPU the nginx container use
  # 995 is how much memmory is left once docker is running
  cpu = "384" # (1024/2) - 128

  memory                   = "369"  # (995/2) - 128
  primary_container_port   = "80"
  secondary_container_port = "8000"

  healthcheck_path = "/management/healthcheck"
  path_pattern     = "/pa11ly*"
}
