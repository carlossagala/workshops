```yaml
  apiVersion: route.openshift.io/v1
  kind: Route
  metadata:
    labels:
      app: workshops
    name: workshops
  spec:
    port:
      targetPort: 8080-tcp
    subdomain: ""
    to:
      kind: Service
      name: workshops
      weight: 100
    wildcardPolicy: None
```

(https://docs.openshift.com/container-platform/4.2/networking/routes/route-configuration.html)[https://docs.openshift.com/container-platform/4.2/networking/routes/route-configuration.html]
(https://docs.openshift.com/container-platform/4.2/networking/routes/secured-routes.html)[https://docs.openshift.com/container-platform/4.2/networking/routes/secured-routes.html]