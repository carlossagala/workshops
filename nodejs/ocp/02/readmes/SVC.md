```yaml
apiVersion: v1
kind: Service
labels:
    app: workshops
name: workshops
spec:
clusterIP: 172.30.241.90
ports:
- name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
selector:
    app: workshops
    deploymentconfig: workshops
sessionAffinity: None
type: ClusterIP
```


(https://docs.openshift.com/container-platform/3.11/architecture/core_concepts/pods_and_services.html)[https://docs.openshift.com/container-platform/3.11/architecture/core_concepts/pods_and_services.html]
(https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)[https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types]