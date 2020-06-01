    watch oc get pods
    oc get routes
    oc expose svc/workshops
    oc get routes
    curl workshops-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/ping -s
    curl workshops-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/exceptions/top -s
    curl workshops-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/exceptions/top -s | jq
    
    oc get bc -lapp=workshops -o yaml
    oc get dc -lapp=workshops -o yaml
    oc get svc -lapp=workshops -o yaml
    oc get route -lapp=workshops -o yaml
    oc get is -lapp=workshops -o yaml


    
