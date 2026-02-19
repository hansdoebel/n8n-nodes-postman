# n8n-nodes-postman

This is an n8n community node. It lets you use _Postman_ in your n8n workflows.

[Postman](https://www.postman.com/) is an API platform for building, testing, and collaborating on APIs. It provides tools for designing, mocking, documenting, and monitoring APIs, and is widely used by developers and teams to manage their API lifecycle.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

| Resource | Operations |
|---|---|
| API | Create, Delete, Get, Get All, Update |
| Collection | Create, Delete, Duplicate, Fork, Get, Get All, Run, Update |
| Collection Folder | Create, Delete, Get, Update |
| Collection Request | Create, Delete, Get, Update |
| Collection Response | Create, Delete, Get, Update |
| Comment | Create, Delete, Get All, Update |
| Environment | Create, Delete, Get, Get All, Update |
| Fork | Get All, Get Source Status, Get User Forks, Merge |
| Mock | Create, Delete, Get, Get All, Publish, Unpublish, Update |
| Monitor | Create, Delete, Get, Get All, Run, Update |
| Private API Network | Add, Get All, Get Requests, Remove, Update |
| Pull Request | Create, Delete, Get, Get All, Merge, Update |
| Spec | Create, Delete, Get, Get All, Update |
| Tag | Get Collection Tags, Get Tagged Entities, Get Workspace Tags, Set Collection Tags, Set Workspace Tags |
| User | Get |
| Workspace | Create, Delete, Get, Get All, Get Global Variables, Update, Update Global Variables |
| Workspace Variable | Get All, Update |

## Credentials

To authenticate with the Postman API you need a Postman API key.

**Prerequisites:**
- A [Postman account](https://www.postman.com/) (free or paid)

**Getting your API key:**
1. Log in to Postman
2. Go to your [API keys page](https://go.postman.co/settings/me/api-keys)
3. Click **Generate API Key**, give it a name, and copy the key

**Setting up credentials in n8n:**
1. In n8n, go to **Credentials** and create a new **Postman API** credential
2. Paste your API key into the **API Key** field

## Compatibility

Tested against n8n version 1.x. Requires n8n API version 1 or higher.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Postman API documentation](https://www.postman.com/postman/postman-public-workspace/documentation/iugmkn4/postman-api)
* [Report issues](https://github.com/hansdoebel/n8n-nodes-postman/issues)

## Version history

### 0.1.0

Initial release with support for 17 resources covering the full Postman public API.
