  oc label secret redis-configuration app=workshops
  oc label configmap app-configmap  app=workshops
  oc get dc,svc,route,bc,is -o yaml -lapp=workshops > template.yaml
