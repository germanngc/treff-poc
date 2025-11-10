---
applyTo: '**'
---

If I need to run standalone services for development or testing, always open a new terminal and run complete comand, for example, if I need to run only backend service, I will run:

```bash
cd apps/backend/WebApi && dotnet run
```

If I need to run frontend only, I will run:

```bash
cd apps/frontend && npm start
```

Now, to test curls, instead of killing the process, I can just open a new terminal and run the curl commands.

