locals {
  alb_id       = "${data.terraform_remote_state.router.alb_id}"
  alb_dns_name = "${data.terraform_remote_state.router.alb_dns_name}"
  // This is taken from the routemaster AWS account which doesn't expose its terraform state
  routemaster_route53_zone_id = "Z3THRVQ5VDYDMC"
}
