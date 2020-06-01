    watch oc get pods
    oc get routes
    oc expose svc/ace
    oc get routes
    curl http://ace-ute.apps.shared.na.openshift.opentlc.com/exceptions/top -s
    curl http://ace-ute.apps.shared.na.openshift.opentlc.com/exceptions/top -s | jq
    
