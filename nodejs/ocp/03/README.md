oc create secret generic redis-configuration --from-literal=redis.password=r3dh4t01! --from-literal=redis.host=redis:6379

---


oc create configmap app-configmap --from-literal=port=8080 --from-literal=path.config=./config/java.json --from-literal=log.level=debug --from-literal=log.path=/tmp/exceptions/ --fro

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: app-configmap
data:
  c.json: |-
    [
        { "id": 1 ,"name": "OverflowException", "count": 0 },
        { "id": 2 ,"name": "SegmentationFaultException", "count": 0 },
        { "id": 3 ,"name": "UnderFlowException", "count": 0 }
    ]
  log.level: debug
  log.path: /tmp/
  path.config: ./config/java.json
  port: '8080'
```
---

```yaml
env:
- name: REDIS
  valueFrom:
    secretKeyRef:
        name: redis-configuration
        key: redis.host
- name: REDIS_PASSWORD
  valueFrom:
    secretKeyRef:
        name: redis-configuration
        key: redis.password
```
---
```yaml
- name: PATH_CONFIG
  valueFrom:
    configMapKeyRef:
      name: app-configmap
      key: path.config
- name: LOG_LEVEL
  valueFrom:
    configMapKeyRef:
      name: app-configmap
      key: log.level
- name: LOG_PATH
  valueFrom:
    configMapKeyRef:
      name: app-configmap
      key: log.path
```
---

```yaml
- name: APP_NAME
  valueFrom:
    fieldRef:
      apiVersion: v1
      fieldPath: 'metadata.labels[''app'']'
- name: POD_NAME
  valueFrom:
    fieldRef:
      apiVersion: v1
      fieldPath: metadata.name
```
---


```yaml
volumeMounts:
  - name: c-exceptions
    mountPath: /opt/app-root/src/config/java.json
    subPath: java.json

volumes:
  - name: c-exceptions
    configMap:
      name: app-configmap
      items:
        - key: c.json
          path: java.json
      defaultMode: 420
```
---



```yaml
- name: logs
  emptyDir: {}

- name: logs
  mountPath: /tmp/exceptions/
```



ref:
- [https://docs.openshift.com/container-platform/3.11/dev_guide/configmaps.html](https://docs.openshift.com/container-platform/3.11/dev_guide/configmaps.html)
- [https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/](https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/)
- [https://docs.openshift.com/container-platform/3.11/dev_guide/downward_api.html](https://docs.openshift.com/container-platform/3.11/dev_guide/downward_api.html)
- [https://v1-14.docs.kubernetes.io/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/](https://v1-14.docs.kubernetes.io/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)


