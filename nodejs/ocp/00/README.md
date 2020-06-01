# Aprovisioning an application in Openshift.

When someone work with Openshift (plataform based in Kubernetes) there are several ways to deploy an application. In this fisrt stage we will use the framework **S2I**. 

S2I is a tool incorporated in Openshift to make more simple the compilation of **Container Images**. This tool use like parameter a repository of Git and an image known as **Builder Image**. This image has scripts which are executed to compile and deploy images. 
When you use S2I, this download the source code of your application and compile using the **Builder image** through a **assemble** script. After that when your image is created, this can be saved in the **Openshift Cluster Registry** or an external registry such as **Docker.io**. 

This framework has the next advantages: 

- is secure
- is easy 
- is fast

You can make your Custom Builder Image if you need with adhoc scripts.


To create our application, we will use the following command:

```bash
oc new-app 
```

But first we need create a redis database because the application needs it.
```bash
oc new-app redis-ephemeral -p DATABASE_SERVICE_NAME=redis -pREDIS_PASSWORD=r3dh4t01!
```

When it has finished to aproviosion, we can exec the next command

```bash
oc new-app nodejs:10~https://github.com/carlossagala/ace --context-dir=nodejs -eREDIS="redis:6379" -eREDIS_PASSWORD=r3dh4t01!
```

When it finish, you can see that several resources was created in your namespace (I did not mention that before but i hope so you have created a namespace :wink:).

You can see that with the command 

```bash
oc get all
```

Also you can see the resources in *Openshift Web Interface*

<TODO: put image here>

The next step is select the **Workloads View** and select **Pods** option. You can see a similar view like the following image.

<TODO: put image build pod>

This "build pod" is in charge of compiling the Container Image of the application using the framewor S2I.

When this finish "correctly", we select the **Builds View** and then **ImageStreams View**

We can see a View like the following image.

<TODO: put image>

When can see in the ImageStream a Tag on their definition this means that we compiled a Container Image in OCP.

<TODO: put image here>

Automatically this action generates a Deploy of that image because this is for default the behavior of components generated with **oc new-app** command.
In the Pods View, we can see that as generated a new **Deploy Pod**. This pod has the objective to deploy the Compiled Image in a new Pod.

When this finish, we can see the app deployed in a pod.

<TODO: put image here>

This continues in the next chapter.
