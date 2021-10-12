# CCE Finesse integration with external customer interaction portal

Sample Fineese gadget that launches a third party customer interaction portal on a separate tab on a web browser and 
performs API calls to detect agent and interaction state on that portal and to set corresponding CCE agent states via Finesse API calls

## Contacts
* Gerardo Chaves (gchaves@cisco.com)
* Raveesh Malyavantham (rmalyava@cisco.com)

## Solution Components
* Unified Contact Center Enterprise  
* Third party customer interaction portal  


## Requirements
   
* Packaged Contact Center Enterprise 12.5 DevNet Sandbox from https://developer.cisco.com/site/sandbox/  
* Third party customer interaction portal  

## Prerequisites


## Installation/Configuration
  

### Reserve and start a PCCE 12.5 DevNet Sandbox

Go to https://devnetsandbox.cisco.com/RM/Topology and reserve a "Packaged Contact Center Enterprise 12.5" Sandbox.

### Connect to sandbox  
Once you receive the email with the subject "Your Cisco DevNet Sandbox Lab is Ready" from the sandbox, follow the instructions 
in the email body to VPN into it with a Cisco AnyConnect client. 

### Test sandbox Finesse Server and IP Phone simulator

Ocassionally, the PCCE sandboxes have Finesse Server and/or IP Phone simulator (Camelot) issues. Before installing the 
sample Gadget from this repository, make sure you can log into Finesse as an agent: 

Launch the Finesse desktop for the agent using one of these 2 methods:

a) Establish a Web RDP connection to the AW1-A virtual machine in the sandbox: 
* hover the mouse over the rectangle representing that VM on the Sandbox and a popup menu appears; on the top there is a triangle and when you click it you should get an 
"RDP" menu option. Click on it and a separate browser tab should appear with a Windows Server Desktop
* Launch Firefox on the desktop. Select the "Finesse Agent" bookmark or just type this URL in the address bar:   
https://fin-pub-a-50.berlin.icm:8445/desktop/container/landing.jsp?locale=en_US    

b) 
Launch a browser on your local machine and navigate to: https://fin-pub-a-50.berlin.icm:8445/desktop/container/landing.jsp?locale=en_US   

For both methods, use the following credentials to log in:  

    *Agent Name:* agent one  
    *Username:* agent1  
    *Password:* cisco123  
    *Extension:* 1001  
  
* You might see an error indicating that "Failed to connect to the phone. Attempting to sign in again in 51 seconds
Attempt: [1/3]"; let it count down and retry.  If if fails to re-connect you might have a bad IP Phone simulator and
will have to reserve another sandbox.

* You might also get a "Finesse server down" type error on the browser. You can try re-booting the Finesse Server on the
sandbox but if that fails to correct the problem, you also need to spin up a new sandbox. 


### Enable the 3rdpartygadget account on the Finesse Server:

From a terminal window on your PC, execute the following commands: 
```
% ssh -l Administrator 10.10.20.50
Administrator@10.10.20.50's password: C!sc0DevNet
Command Line Interface is starting up, please wait ...

   Welcome to the Platform Command Line Interface

VMware Installation:
	4 vCPU: Intel(R) Xeon(R) CPU E5-4669 v4 @ 2.20GHz
	Disk 1: 146GB, Partitions aligned
	4096 Mbytes RAM

admin:utils reset_3rdpartygadget_password
New Password: ciscocisco
Confirm New Password: ciscocisco
Updating password for 3rdpartygadget...

Password updated successfully.
admin:
```  

At this point you could type the `exit` command, but you will need to execute another command to restart the finesse server after updating the gadget so leave the connection active.  


### Upload the AcquireApp sample gadget

The following instructions are for using the [FileZilla](https://filezilla-project.org/) SFTP client to transfer the gadget from your PC 
that you downloaded from this code repository to 
the Finesse server in the PCCE dCloud demo instance, but you can use any other SFTP tool and use these instructions as a reference only:  

In the quickconnect bar,  

Enter the Finesse FQDN: 10.10.20.50 in the Host field.  
Enter 3rdpartygadget in the Username field.  
Enter ciscocisco in the Password field. This is the 3rdpartygadget password defined in the previous step (ciscocisco).  
Enter 22 in the Port field.  
Click Quickconnect.  

In the remote site section, confirm that you see a folder named / and you can see the files folder below  

Transfer the updated AcquireApp gadget:

Drag the AcquireApp folder (that contains the xml, js, and css) from your local computer into the files/ folder on the 
Finesse server.  

Confirm that the transfer was successful by checking that the transfers shows up in the Successful transfers tab at the bottom.

Change the file permissions of the gadget files. The gadget files have to have public read permissions for it to be loaded on the Finesse agent desktop.

Select the AcquireApp folder.

Right-click on the AcquireApp folder.

From the dropdown menu, select File permissions....

A Change file attributes window appears.

Under Public permissions verify that Read permissions is selected.

Select Recurse into subdirectories.

Click OK.

Confirm that you can access the gadget:

Open Chrome and go to the following URL: https://10.10.20.50:8445/3rdpartygadget/files/AcquireApp/AcquireApp.xml  

If the sample gadget was uploaded successfully, you will see content of the AcquireApp.xml file in the browser window.

You also need to enable CORS on Finesse server so that the modified Acquire Gadget can make Acquire.io API call. While still on the Finesse Server CLI, execute the following commands 
shown after the admin: prompts below:    

```
admin:utils finesse cors enable all

Cisco Finesse CORS is enabled now.

Ensure CORS is enabled in all the Finesse nodes in the cluster.

Currently no origins are configured in allowed origins.

Ensure that origins are configured and then,

Restart Cisco Finesse Tomcat and Notification Service for the changes to take effect:
 utils service restart Cisco Finesse Tomcat
 utils service restart Cisco Finesse Notification Service

```

### Add the gadget to the agent's desktop layout  
Open Chrome and enter the following URL to go to the Finesse Administration Console: https://fin-pub-a-50.berlin.icm:8445/cfadmin/

Enter the administrator's username:  Admin in the ID field.

Enter the administrator's password: C!sc0DevNet in the Password field.

Click the Desktop Layout tab

NOTE: Sometimes it takes a while for the Desktop Layout user interface elements to show on the browser, but if it takes longer than a minute you might 
want to try with a different browser.

Add the new AcquireApp Gadget right before the TaskManagement Gadget within the Home tab for the Agent layout. 
You might also want to remove all other gadgets in the home tab so only the AcquireApp Gadget remains. If so, the 
section corresponding to that tab should end up looking like this:  
``` 
            <tab>
                <id>home</id>
                <icon>home</icon>
                <label>finesse.container.tabs.agent.homeLabel</label>
                <columns>
                    <column>
                        <gadgets>
                          	<gadget>/3rdpartygadget/files/AcquireApp/AcquireApp.xml</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
```

Click on the Save button at the bottom of the page. 

After updating any gadget files or layouts, you must restart the finesse server using the following command 
also while connected to the Finesse server CLI:  

```
admin:utils service restart Cisco Finesse Tomcat
 Don't press Ctrl-c while the service is getting RESTARTED.If Service has not Restarted Properly, execute the same Command Again
Service Manager is running
Cisco Finesse Tomcat[STOPPING]  
Cisco Finesse Tomcat[STOPPING]  
Cisco Finesse Tomcat[STARTING]  
Cisco Finesse Tomcat[STARTING]  
Cisco Finesse Tomcat[STARTING]  
Cisco Finesse Tomcat[STARTING]  
Cisco Finesse Tomcat[STARTING]  
Cisco Finesse Tomcat[STARTED]  
Cisco Finesse Tomcat[STARTED]  
admin:

```

## Usage


* On your local machine, launch the Finesse desktop for the agent:    
https://fin-pub-a-50.berlin.icm:8445/desktop/container/landing.jsp?locale=en_US  

    *Agent Name:* agent one  
    *Username:* agent1  
    *Password:* cisco123  
    *Extension:* 1001  


* On the home tab, you will see the Acquire gadget as the first one with a button to open Acquire.io. Click on the button 
to launch the Acquire agent desktop on a separate tab.  

* Inspect (open developer tools) the browser you are using for Finesse and open the Console window. Now toggle 
agent availability between Ready and some other state. Notice on the console there are messages like "=====Gadget.Log -> Agent Not Ready ======" 
and "=====Gadget.Log -> Not Ready reason code: ". If you look for these in the `AcquireApp.js` source code, you can
 find the location where you can add your own code to make API calls out to the third party portal to report agent 
 status on the Cisco Unified Contact Center Enterprise side be it manually originated in the Finesse interface, or 
generated by the system (i.e. agent does not answer call routed to him/her in a predetermined amount of time)


# Screenshots





### LICENSE

Provided under Cisco Sample Code License, for details see [LICENSE](LICENSE.md)

### CODE_OF_CONDUCT

Our code of conduct is available [here](CODE_OF_CONDUCT.md)

### CONTRIBUTING

See our contributing guidelines [here](CONTRIBUTING.md)

#### DISCLAIMER:
<b>Please note:</b> This script is meant for demo purposes only. All tools/ scripts in this repo are released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of these scripts and tools is at your own risk. There is no guarantee that they have been through thorough testing in a comparable environment and we are not responsible for any damage or data loss incurred with their use.
You are responsible for reviewing and testing any scripts you run thoroughly before use in any non-testing environment.