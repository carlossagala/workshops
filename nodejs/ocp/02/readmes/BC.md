# BuildConfig

About this resource, I mentioned these words:
<em>contains all the settings to carry out the compilation of the new Image.
</em>

To understand that, we will look at our yml extension file for parts.

```yaml
apiVersion: v1
items:
- apiVersion: build.openshift.io/v1
  kind: BuildConfig
  metadata:
    labels:
      app: workshops
    name: workshops
  spec:
    failedBuildsHistoryLimit: 5
    nodeSelector: null
    output:
      to:
        kind: ImageStreamTag
        name: workshops:latest
    postCommit: {}
    resources: {}
    runPolicy: Serial
    source:
      contextDir: nodejs
      git:
        uri: https://github.com/carlossagala/workshops.git
      sourceSecret:
        name: git
      type: Git
    strategy:
      sourceStrategy:
        from:
          kind: ImageStreamTag
          name: nodejs:10
          namespace: openshift
      type: Source
    successfulBuildsHistoryLimit: 5
    triggers:
    - type: ConfigChange
    - imageChange:
        lastTriggeredImageID: image-registry.openshift-image-registry.svc:5000/openshift/nodejs@sha256:bce9d648821108fb7046b33b6f3f1b49607fd44a242de2a6a0a538f56e353153
      type: ImageChange
```
---

```yaml
    nodeSelector: null
```
When we compile an Image in Openshift, internally we generate the provisioning of a build pod that does that work. With that property if you know what are the worker nodes in the cluster you can define rules to select in which node the build pod is provisioned.

---

```yaml
    output:
      to:
        kind: ImageStreamTag
        name: workshops:latest
```
With this setting you are indicating to the BC that the result Container Image must be saved as workshop ImageStreamTag 's **latest** Tag. You can in this setting generate a Docker Image instead of a ISTAG and push it to an External Docker Registry. For this action is probable that you need specified credentials to make a push (an ImagePullSecret for example).

You can specific this credentials in the Service Account **Builder** or set it in the yaml like this:

```bash
oc set build-secret --push bc/sample-build dockerhub
```

```yaml
spec:
  output:
    to:
      kind: "DockerImage"
      name: "private.registry.com/org/private-image:latest"
    pushSecret:
      name: "dockerhub"
```

---

```yaml
    postCommit: {}
```
This property is used to exec scripts to control if the Image generated can pass a set of test definied for the developers and other actors. The scripts are exectured when the image finish their compilation and before that is pushed to the registry. For more information look at refs.

---

```yaml
    resources: {}
```
With this property you can define what is the minimium necesary to compile your image and the maximun that should use of memory and cpu of a node. When this property is not defined, the build pod genetated can consume until limits predefinied by the cluster admin with LimitRanges or if this limits dont exist, the pod can consume the resources whitout limit until where it can in the node in where was provisioned.

```yaml
  resources:
    limits:
      cpu: "1" 
      memory: "1024Mi"
    requests:
      cpu: "100m"
      memory: "256Mi"
```
---

```yaml
    runPolicy: Serial
```

This property define how the builds are executed. For example with Serial only a build can run alone. For more information see the refs "advanced-build-operations".

---
```yaml
source:
      contextDir: nodejs
      git:
        uri: https://github.com/carlossagala/workshops.git
      sourceSecret:
        name: git
      type: Git
```
In this section is defined what resources are necesaries to compile the image such as source code, compiled binaries, a Dockerfile or maybe another image. 
In summary, the sources will be used to compile Images. You can make more complex builds like a Chained Builds using two buildConfig

The first is for download and compile the artifacts, and the second to build a principal image with a dockerfile using the artifact generated in the previous Image

```yaml
---
apiVersion: v1
kind: BuildConfig
metadata:
  name: artifact-build
spec:
  output:
    to:
      kind: ImageStreamTag
      name: artifact-image:latest
  source:
    git:
      uri: https://github.com/openshift/openshift-jee-sample.git
  strategy:
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: wildfly:10.1
        namespace: openshift
---
apiVersion: v1
kind: BuildConfig
metadata:
  name: image-build
spec:
  output:
    to:
      kind: ImageStreamTag
      name: image-build:latest
  source:
    dockerfile: |-
      FROM jee-runtime:latest
      COPY ROOT.war /deployments/ROOT.war
    images:
    - from: 
        kind: ImageStreamTag
        name: artifact-image:latest
      paths: 
      - sourcePath: /wildfly/standalone/deployments/ROOT.war
        destinationDir: "."
  strategy:
    dockerStrategy:
      from: 
        kind: ImageStreamTag
        name: jee-runtime:latest
```

---

```yaml
    strategy:
      sourceStrategy:
        from:
          kind: ImageStreamTag
          name: nodejs:10
          namespace: openshift
      type: Source
```

The Strategy correspond to define how is compiled the Image. There are Four option for the moment:

- sourceStrategy: define that the Image is compiled with source code (from Git or pre-compiled artifacts it is posible too in this case!).
- dockerStrategy: define that compilation is with a dockerfile
- pipelineStrategy: define that a BuildConfig is used like a pipeline in a Jenkins provisioned in a namespace. This strategy is not recomended in the next releases of Openshift because it will be replaced with Openshift-Pipeline (feature based in Tekton - in another words, pipeline that run native in kubernetes clusters)
- customStrategy
---
```yaml
    successfulBuildsHistoryLimit: 5
```

Define how many success builds are saved for the moment, in another words represent the number of the preserved available executions there are.
This is very useeful to look at errors in logs. 
Also is recommended use the proprty **failedBuildsHistoryLimit** to saved some failed builds.


---
```yaml
    triggers:
    - type: ConfigChange
    - imageChange:
        lastTriggeredImageID: image-registry.openshift-image-registry.svc:5000/openshift/nodejs@sha256:bce9d648821108fb7046b33b6f3f1b49607fd44a242de2a6a0a538f56e353153
      type: ImageChange
```
With this property define which events start new compilations of automatic way. In the BC, you can generate automatic compilations with events such as: changes in the Builder Image used, changes in the BC' setting or define triggers to start build of remote way with a webhook. 


This is a summary of Red Hat's documentation. For more information, you can look at [https://access.redhat.com](https://access.redhat.com) or  
[https://docs.openshift.com/](https://docs.openshift.com/)


### Ref:

- [https://www.openshift.com/blog/pushing-application-images-to-an-external-registry](https://www.openshift.com/blog/pushing-application-images-to-an-external-registry)
- [https://docs.openshift.com/container-platform/3.11/dev_guide/builds/build_inputs.html](https://docs.openshift.com/container-platform/3.11/dev_guide/builds/build_inputs.html)
- [https://docs.openshift.com/container-platform/3.11/dev_guide/builds/build_hooks.html](https://docs.openshift.com/container-platform/3.11/dev_guide/builds/build_hooks.html)
- [https://docs.openshift.com/container-platform/4.2/builds/advanced-build-operations.html](https://docs.openshift.com/container-platform/4.2/builds/advanced-build-operations.html)
- [https://docs.openshift.com/container-platform/3.11/dev_guide/builds/index.html](https://docs.openshift.com/container-platform/3.11/dev_guide/builds/index.html)
