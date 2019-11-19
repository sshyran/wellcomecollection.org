resource "aws_acm_certificate" "preview" {
  provider = "aws.us-east-1"
  domain_name   = "preview.wellcomecollection.org"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  provider = "aws.routemaster"
  name     = "${aws_acm_certificate.preview.domain_validation_options.0.resource_record_name}"
  type     = "${aws_acm_certificate.preview.domain_validation_options.0.resource_record_type}"
  zone_id  = "${local.routemaster_route53_zone_id}"
  records  = ["${aws_acm_certificate.preview.domain_validation_options.0.resource_record_value}"]
  ttl      = 60
}

resource "aws_acm_certificate_validation" "preview_validation" {
  provider                = "aws.us-east-1"
  certificate_arn         = "${aws_acm_certificate.preview.arn}"
  validation_record_fqdns = ["${aws_route53_record.cert_validation.fqdn}"]
}

# This is a cache that essentially does nothing, but gives us a shield against our origin ALB
resource "aws_cloudfront_distribution" "preview" {
  origin {
    domain_name = "${local.alb_dns_name}"
    origin_id   = "${local.alb_id}"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true

  aliases = ["preview.wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "${local.alb_id}"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "${aws_acm_certificate_validation.preview_validation.certificate_arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  retain_on_delete = true
}
