NestJS Permission Manager
A robust and flexible permission and role management module for NestJS applications using Mongoose. This package provides a comprehensive solution for managing permissions and user permission assignments, complete with decorators, guards, and exception handling to secure your application endpoints.
Table of Contents

Features
Installation
Setup
Usage
Permission Management
User Permission Management
Protecting Endpoints with Permission Guard


API Endpoints
Permission Endpoints
User Permission Endpoints


Error Handling
Logging
Project Structure
Contributing
License

Features

Dynamic Module Integration: Seamlessly integrates with NestJS using dynamic modules.
Mongoose Schemas: Predefined schemas for permissions and user permissions.
CRUD Operations: Full support for creating, reading, updating, and deleting permissions and user permission assignments.
Permission Guard: Secure your endpoints by checking user permissions using a custom guard.
Decorator Support: Easily specify required permissions using the @RequiredPermission decorator.
Global Exception Filter: Handles errors gracefully with detailed responses.
Logging: Built-in logging for debugging and monitoring.
Validation: Uses class-validator for DTO validation to ensure data integrity.

Installation
Install the package via npm:
npm install nestjs-permission-manager

Ensure you have the following peer dependencies installed in your NestJS project:
npm install @nestjs/core @nestjs/common @nestjs/mongoose mongoose class-validator

Setup

Register the Modules:Import and register the PermissionModule and UserPermissionModule in your NestJS application.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from 'nestjs-permission-manager';
import { UserPermissionModule } from 'nestjs-permission-manager';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/your-database'),
    PermissionModule.forFeature(),
    UserPermissionModule.forFeature(),
  ],
})
export class AppModule {}


Apply Global Exception Filter:Add the GlobalExceptionFilter to handle errors globally.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from 'nestjs-permission-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();



Usage
Permission Management
The PermissionModule provides functionality to manage permissions, including creating, retrieving, updating, and deleting permissions.
Example: Creating a Permission
import { CreatePermissionDto } from 'nestjs-permission-manager';

const createPermissionDto: CreatePermissionDto = {
  name: 'read:users',
  description: 'Allows reading user data',
};

const response = await fetch('http://localhost:3000/permission/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(createPermissionDto),
});

User Permission Management
The UserPermissionModule allows assigning permissions to users and managing these assignments.
Example: Assigning Permissions to a User
import { CreateUserPermissionDto } from 'nestjs-permission-manager';

const createUserPermissionDto: CreateUserPermissionDto = {
  userId: '507f1f77bcf86cd799439011',
  label: 'User Permissions',
  permissions: ['507f191e810c19729de860ea'], // Permission IDs
};

const response = await fetch('http://localhost:3000/user-permission/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(createUserPermissionDto),
});

Protecting Endpoints with Permission Guard
Use the @RequiredPermission decorator and PermissionGuard to protect your endpoints.
Example: Protecting a Controller
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequiredPermission, PermissionGuard } from 'nestjs-permission-manager';

@Controller('protected')
@UseGuards(PermissionGuard)
export class ProtectedController {
  @Get('data')
  @RequiredPermission('read:users')
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}

API Endpoints
Permission Endpoints



Method
Endpoint
Description
Request Body
Response



POST
/permission/create
Create a new permission
CreatePermissionDto
Permission


GET
/permission
Get all permissions
-
Permission[]


GET
/permission/:id
Get a permission by ID
-
Permission


PATCH
/permission/:id
Update a permission
UpdatePermissionDto
Permission


DELETE
/permission/:id
Delete a permission
-
Permission


User Permission Endpoints



Method
Endpoint
Description
Request Body
Response



POST
/user-permission/create
Create a new user permission
CreateUserPermissionDto
UserPermission


GET
/user-permission
Get all user permissions
-
UserPermission[]


GET
/user-permission/:id
Get a user permission by ID
-
UserPermission


PATCH
/user-permission/:id
Update a user permission
UpdateUserPermissionDto
UserPermission


DELETE
/user-permission/:id
Delete a user permission
-
-


DTO Schemas

CreatePermissionDto:{
  name: string; // Required, unique
  description: string; // Required
}


UpdatePermissionDto:{
  name?: string; // Optional
  description?: string; // Optional
}


CreateUserPermissionDto:{
  userId: string; // Required, valid MongoDB ObjectId
  label: string; // Required
  permissions: string[]; // Required, array of valid permission IDs
}


UpdateUserPermissionDto:{
  userId?: string; // Optional
  label?: string; // Optional
  permissions?: string[]; // Optional, array of valid permission IDs
}



Error Handling
The package includes a GlobalExceptionFilter that catches and formats errors, providing consistent error responses. Common HTTP status codes include:

400 Bad Request: Invalid input (e.g., invalid ObjectId, missing required fields).
404 Not Found: Resource (e.g., permission or user permission) not found.
409 Conflict: Duplicate resource (e.g., permission name already exists).
403 Forbidden: User lacks required permissions.
401 Unauthorized: User not authenticated.

Example Error Response:
{
  "statusCode": 404,
  "message": "Permission not found",
  "path": "/permission/123",
  "timestamp": "2025-07-24T13:21:00.000Z"
}

Logging
The LoggerModule provides a LoggerService for logging operations. It logs:

Permission creation, updates, and deletions.
User permission creation, updates, and deletions.
Errors and unexpected exceptions.

Logs are output using NestJS's built-in Logger with contextual information.
Project Structure
nestjs-permission-manager/
├── common/
│   ├── decorators/
│   │   └── permission.decorator.ts
│   ├── filters/
│   │   └── global-exception.filter.ts
│   ├── guards/
│   │   └── permission.guard.ts
│   └── services/
│       ├── logger.module.ts
│       └── logger.service.ts
├── permission/
│   ├── dto/
│   │   ├── create-permission.dto.ts
│   │   └── update-permission.dto.ts
│   ├── permission.controller.ts
│   ├── permission.module.ts
│   └── permission.service.ts
├── schemas/
│   ├── permission.schema.ts
│   └── user-permission.schema.ts
├── user-permission/
│   ├── dto/
│   │   ├── create-user-permission.dto.ts
│   │   └── update-user-permission.dto.ts
│   ├── user-permission.controller.ts
│   ├── user-permission.module.ts
│   └── user-permission.service.ts
└── index.ts

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Ensure your code follows the existing style and includes tests.
License
This project is licensed under the MIT License. See the LICENSE file for details.