# Postman Node — Resources & Operations

> Postman API reference: [Introduction to the Postman API](https://learning.postman.com/docs/developer/postman-api/intro-api/)

## About the Postman API

The Postman API lets you programmatically manage your Postman assets and integrate Postman into your development toolchain. All requests are authenticated via an **API key** and target the base URL `https://api.postman.com/`. Only **v10+** endpoints are supported (v9 API Builder endpoints are deprecated).

---

## Resources

### API
Manage APIs defined in your Postman workspaces.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new API |
| `delete` | Delete an API |
| `get` | Get a single API by ID |
| `getAll` | List all APIs in a workspace |
| `update` | Update an existing API |

---

### Collection
Manage Postman collections.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new collection |
| `delete` | Delete a collection |
| `duplicate` | Duplicate a collection |
| `fork` | Fork a collection into a workspace |
| `get` | Get a single collection by ID |
| `getAll` | List all collections |
| `run` | Run a collection |
| `update` | Update a collection |

---

### Collection Folder
Manage folders inside a collection.

| Operation | Description |
|-----------|-------------|
| `create` | Create a folder in a collection |
| `delete` | Delete a folder |
| `get` | Get a single folder by ID |
| `update` | Update a folder |

---

### Collection Request
Manage requests inside a collection.

| Operation | Description |
|-----------|-------------|
| `create` | Create a request in a collection |
| `delete` | Delete a request |
| `get` | Get a single request by ID |
| `update` | Update a request |

---

### Collection Response
Manage saved responses inside a collection request.

| Operation | Description |
|-----------|-------------|
| `create` | Create a saved response |
| `delete` | Delete a saved response |
| `get` | Get a saved response by ID |
| `update` | Update a saved response |

---

### Collection Role
Manage role assignments for a collection. Requires an Enterprise plan.

| Operation | Description |
|-----------|-------------|
| `get` | Get all roles assigned to a collection |
| `update` | Update role assignments for a collection |

---

### Comment
Manage comments on APIs, collections, folders, requests, and responses.

| Operation | Description |
|-----------|-------------|
| `create` | Post a new comment |
| `delete` | Delete a comment |
| `getAll` | List all comments on an entity |
| `update` | Update a comment |

---

### Environment
Manage Postman environments and their variables.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new environment |
| `delete` | Delete an environment |
| `get` | Get a single environment by ID |
| `getAll` | List all environments |
| `update` | Update an environment |

---

### Fork
Manage collection and environment forks.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all forks of a collection or environment |
| `getSourceStatus` | Get the status of a fork relative to its source |
| `getUserForks` | List forks created by the authenticated user |
| `merge` | Merge a fork back into its source |

---

### Mock
Manage Postman mock servers.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new mock server |
| `delete` | Delete a mock server |
| `get` | Get a single mock server by ID |
| `getAll` | List all mock servers |
| `publish` | Publish a mock server (make it publicly accessible) |
| `unpublish` | Unpublish a mock server |
| `update` | Update a mock server |

---

### Monitor
Manage Postman monitors.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new monitor |
| `delete` | Delete a monitor |
| `get` | Get a single monitor by ID |
| `getAll` | List all monitors |
| `run` | Trigger a monitor run |
| `update` | Update a monitor |

---

### Private API Network
Manage the Private API Network (Enterprise).

| Operation | Description |
|-----------|-------------|
| `add` | Add an element to the Private API Network |
| `getAll` | List all elements in the Private API Network |
| `getRequests` | List pending add requests |
| `remove` | Remove an element from the Private API Network |
| `update` | Update a Private API Network element |

---

### Pull Request
Manage pull requests for forks.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new pull request |
| `delete` | Delete a pull request |
| `get` | Get a single pull request by ID |
| `getAll` | List all pull requests |
| `merge` | Merge a pull request |
| `update` | Update a pull request |

---

### Spec
Manage API specifications (e.g. OpenAPI definitions).

| Operation | Description |
|-----------|-------------|
| `create` | Create a new spec for an API |
| `delete` | Delete a spec |
| `get` | Get a single spec by ID |
| `getAll` | List all specs for an API |
| `update` | Update a spec |

---

### Tag
Manage tags on collections and workspaces.

| Operation | Description |
|-----------|-------------|
| `getCollectionTags` | Get all tags on a collection |
| `getTaggedEntities` | List all entities with a given tag |
| `getWorkspaceTags` | Get all tags on a workspace |
| `setCollectionTags` | Set (replace) tags on a collection |
| `setWorkspaceTags` | Set (replace) tags on a workspace |

---

### Team
Manage teams in your Postman organization. Requires an Enterprise plan with Postman Organizations enabled and Super Admin role.

| Operation | Description |
|-----------|-------------|
| `approveAccessRequest` | Approve or deny a team access request |
| `create` | Create a new team |
| `createAccessRequest` | Create an access request for a team |
| `get` | Get a single team by ID |
| `getAll` | List all teams in the organization |
| `getAccessRequests` | Get a team's pending access requests |
| `getSettings` | Get a team's settings |
| `manageMemberRoles` | Add or remove roles for team members |
| `removeMembers` | Remove members from a team |
| `updateSettings` | Update a team's settings |

---

### User
Retrieve authenticated user information.

| Operation | Description |
|-----------|-------------|
| `get` | Get the currently authenticated user |

---

### Workspace
Manage Postman workspaces and their global variables.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new workspace |
| `delete` | Delete a workspace |
| `get` | Get a single workspace by ID |
| `getAll` | List all workspaces |
| `getGlobalVariables` | Get all global variables in a workspace |
| `update` | Update a workspace |
| `updateGlobalVariables` | Update global variables in a workspace |

---

### Workspace Role
Manage role assignments for a workspace. Requires an Enterprise plan.

| Operation | Description |
|-----------|-------------|
| `get` | Get all roles assigned to a workspace |
| `getRoleTypes` | List all assignable workspace role types |
| `update` | Update role assignments for a workspace |

---

### Workspace Variable
Manage variables scoped to a workspace.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all variables in a workspace |
| `update` | Update workspace variables |

---

## Summary

| Resource | Operations |
|----------|-----------|
| API | create, delete, get, getAll, update |
| Collection | create, delete, duplicate, fork, get, getAll, run, update |
| Collection Folder | create, delete, get, update |
| Collection Request | create, delete, get, update |
| Collection Response | create, delete, get, update |
| Collection Role | get, update |
| Comment | create, delete, getAll, update |
| Environment | create, delete, get, getAll, update |
| Fork | getAll, getSourceStatus, getUserForks, merge |
| Mock | create, delete, get, getAll, publish, unpublish, update |
| Monitor | create, delete, get, getAll, run, update |
| Private API Network | add, getAll, getRequests, remove, update |
| Pull Request | create, delete, get, getAll, merge, update |
| Spec | create, delete, get, getAll, update |
| Tag | getCollectionTags, getTaggedEntities, getWorkspaceTags, setCollectionTags, setWorkspaceTags |
| Team | approveAccessRequest, create, createAccessRequest, get, getAll, getAccessRequests, getSettings, manageMemberRoles, removeMembers, updateSettings |
| User | get |
| Workspace | create, delete, get, getAll, getGlobalVariables, update, updateGlobalVariables |
| Workspace Role | get, getRoleTypes, update |
| Workspace Variable | getAll, update |
