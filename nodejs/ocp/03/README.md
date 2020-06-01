12053  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/pod -s
12054  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/password -s
12055  oc get pods
12056  history
12057  oc get pods
12058  oc rsh ace-2-l6tkh
12059  oc logs ace-2-l6tkh
12060  oc get pods
12061  oc rsh ace-2-l6tkh
12062  oc logs ace-2-l6tkh
12063  oc create secret generic redis-configuration --from-literal=redis.password=r3dh4t01! --from-literal=redis.host=redis:6379\n
12064  oc create configmap app-configmap --from-literal=port=8080 --from-literal=path.config=./config/java.json --from-literal=log.level=debug --from-literal=log.path=/tmp/exceptions/ --from-file=./config/c.json \n


### Secret
oc create secret generic redis-configuration --from-literal=redis.password=r3dh4t01! --from-literal=redis.host=redis:6379

kind: Secret
apiVersion: v1
metadata:
  name: redis-config
  namespace: exceptions
data:
  redis.password: cjNkaDR0MDEh
type: Opaque

### ConfigMap

oc create configmap app-configmap --from-literal=port=8080 --from-literal=path.config=./config/java.json --from-literal=log.level=debug --from-literal=log.path=/tmp/exceptions/ --from-file=./config/c.json 

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

### Set values 

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


curl http://workshops-exceptions.apps.shared.na.openshift.opentlc.com/password


ConfigMap

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

POD information 

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

Using a configMap like volume 

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



Using a persistentVolume to save logs 


        - name: logs
          emptyDir: {}

        - name: logs
          mountPath: /tmp/exceptions/

11996  oc get cm
11997  oc get secret
11998  oc label secret redis-configuration app=workshops
11999  oc label configmap app-configmap  app=workshops






















ref:
- [https://docs.openshift.com/container-platform/3.11/dev_guide/configmaps.html](https://docs.openshift.com/container-platform/3.11/dev_guide/configmaps.html)
- [https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/](https://v1-14.docs.kubernetes.io/docs/concepts/storage/volumes/)
- 



```YAML
 template:
    metadata:
      creationTimestamp: null
      labels:
        app: ace
        deploymentconfig: ace
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
    spec:
      containers:
        - name: ace
          image: >-
            image-registry.openshift-image-registry.svc:5000/exceptions/ace@sha256:626b472e47f2dd4749f4eb7afeeae627739c4bc5359047cdfaa84f488427fb92
          ports:
            - containerPort: 8080
              protocol: TCP
          env:
            - name: REDIS
              value: 'redis:6379'
            - name: REDIS_PASSWORD
              value: r3dh4t01!
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
```

```YAML
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: ace
        deploymentconfig: ace
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
    spec:
      containers:
        - name: ace
          image: >-
            image-registry.openshift-image-registry.svc:5000/exceptions/ace@sha256:626b472e47f2dd4749f4eb7afeeae627739c4bc5359047cdfaa84f488427fb92
          ports:
            - containerPort: 8080
              protocol: TCP
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
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
```
next add configmap values 

```yaml
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: ace
        deploymentconfig: ace
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
    spec:
      containers:
        - name: ace
          image: >-
            image-registry.openshift-image-registry.svc:5000/exceptions/ace@sha256:626b472e47f2dd4749f4eb7afeeae627739c4bc5359047cdfaa84f488427fb92
          ports:
            - containerPort: 8080
              protocol: TCP
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
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
```
in the end 

```yaml
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: ace
        deploymentconfig: ace
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
    spec:
      containers:
        - name: ace
          image: >-
            image-registry.openshift-image-registry.svc:5000/exceptions/ace@sha256:626b472e47f2dd4749f4eb7afeeae627739c4bc5359047cdfaa84f488427fb92
          ports:
            - containerPort: 8080
              protocol: TCP
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
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
```

at this point we set configs with configmaps and secrets but


```yaml
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: ace
        deploymentconfig: ace
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
    spec:
      containers:
        - name: ace
          image: >-
            image-registry.openshift-image-registry.svc:5000/exceptions/ace@sha256:626b472e47f2dd4749f4eb7afeeae627739c4bc5359047cdfaa84f488427fb92
          ports:
            - containerPort: 8080
              protocol: TCP
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
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
          volumeMounts:
            - name: c-exceptions
              mountPath: /opt/app-root/src/config/java.json
              subPath: java.json
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
      volumes:
        - name: c-exceptions
          configMap:
            name: app-configmap
            items:
              - key: c.json
                path: java.json
            defaultMode: 420
```

10009  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/exceptions/top -s | jq
10010  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/clean -I
10011  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/clean -X DELETE -I
10012  curl ace-exceptions.apps.cluster-e8fc.e8fc.sandbox1648.opentlc.com/exceptions/top -s | jq


