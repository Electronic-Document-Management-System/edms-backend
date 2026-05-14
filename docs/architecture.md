# Architecture

## Backend Architecture Pattern

The EDMS backend follows a modular monolith architecture with a layered structure.

Each business area is organized as a separate module. This keeps the codebase maintainable while avoiding the operational complexity of microservices at the early development stage.

## Core Pattern

```text
Route → Controller → Service → Data Access Layer → Database
````

## Module Structure

```text
src/modules/
  auth/
  users/
  rbac/
  documents/
  workflow/
  audit/
```

## Why Modular Monolith?

A modular monolith is suitable for the current phase because:

* It keeps deployment simple.
* It allows clear separation between modules.
* It supports future extraction into services if required.
* It reduces unnecessary complexity during early development.

## Authorization Architecture

Authorization is designed using permission-based RBAC.

Instead of checking hardcoded role names, the system checks permissions using the following structure:

```text
resource:action:scope
```

Example:

```text
document:approve:department
```

This allows the system to support different departments, roles, and organizational configurations without creating separate tables or hardcoded logic.