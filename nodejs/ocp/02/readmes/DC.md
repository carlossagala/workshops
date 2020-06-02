# Deployment Config

```yaml
- apiVersion: apps.openshift.io/v1
  kind: DeploymentConfig
  metadata:
    labels:
      app: workshops
    name: workshops
  spec:
    replicas: 1
    revisionHistoryLimit: 10
    selector:
      app: workshops
      deploymentconfig: workshops
    strategy:
      activeDeadlineSeconds: 21600
      resources: {}
      rollingParams:
        intervalSeconds: 1
        maxSurge: 25%
        maxUnavailable: 25%
        timeoutSeconds: 600
        updatePeriodSeconds: 1
      type: Rolling
    template:
      metadata:
        annotations:
          openshift.io/generated-by: OpenShiftNewApp
        creationTimestamp: null
        labels:
          app: workshops
          deploymentconfig: workshops
      spec:
        containers:
        - env:
          - name: REDIS
            value: redis:6379
          - name: REDIS_PASSWORD
            value: r3dh4t01!
          image: image-registry.openshift-image-registry.svc:5000/exceptions/workshops@sha256:281534a2c1fa9b70e59747baf01edda10c2687fb6e333d239bd4904d9ca280d8
          imagePullPolicy: Always
          name: workshops
          ports:
          - containerPort: 8080
            protocol: TCP
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
        dnsPolicy: ClusterFirst
        restartPolicy: Always
        schedulerName: default-scheduler
        securityContext: {}
        terminationGracePeriodSeconds: 30
    test: false
    triggers:
    - type: ConfigChange
    - imageChangeParams:
        automatic: true
        containerNames:
        - workshops
        from:
          kind: ImageStreamTag
          name: workshops:latest
          namespace: exceptions
        lastTriggeredImage: image-registry.openshift-image-registry.svc:5000/exceptions/workshops@sha256:281534a2c1fa9b70e59747baf01edda10c2687fb6e333d239bd4904d9ca280d8
      type: ImageChange
```


---


## refs:

- [https://docs.openshift.com/container-platform/4.2/applications/deployments/what-deployments-are.html](https://docs.openshift.com/container-platform/4.2/applications/deployments/what-deployments-are.html)
- [https://docs.openshift.com/container-platform/4.2/applications/deployments/deployment-strategies.html](https://docs.openshift.com/container-platform/4.2/applications/deployments/deployment-strategies.html)
- [https://www.openshift.com/blog/using-post-hook-to-initialize-a-database](https://www.openshift.com/blog/using-post-hook-to-initialize-a-database)
- [https://docs.openshift.com/container-platform/4.2/openshift_images/managing_images/image-pull-policy.html](https://docs.openshift.com/container-platform/4.2/openshift_images/managing_images/image-pull-policy.html)
- [https://www.openshift.com/blog/kubernetes-pods-life](https://www.openshift.com/blog/kubernetes-pods-life)
- [https://kubernetes.io/docs/tasks/debug-application-cluster/determine-reason-pod-failure/](https://kubernetes.io/docs/tasks/debug-application-cluster/determine-reason-pod-failure/)
- [https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pods-dns-policy](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pods-dns-policy)
- [https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
- [https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html)
- [https://docs.openshift.com/container-platform/4.2/authentication/understanding-and-creating-service-accounts.html](https://docs.openshift.com/container-platform/4.2/authentication/understanding-and-creating-service-accounts.html)
- [https://docs.openshift.com/container-platform/3.11/admin_guide/manage_scc.html](https://docs.openshift.com/container-platform/3.11/admin_guide/manage_scc.html)
- [https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/advanced_deployment_strategies.html#graceful-termination](https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/advanced_deployment_strategies.html#graceful-termination)
- [https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/](https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/)
- [https://docs.openshift.com/container-platform/4.2/applications/application-health.html](https://docs.openshift.com/container-platform/4.2/applications/application-health.html)
- [https://access.redhat.com/documentation/en-us/openshift_container_platform/3.11/html/developer_guide/dev-guide-volumes](https://access.redhat.com/documentation/en-us/openshift_container_platform/3.11/html/developer_guide/dev-guide-volumes)
