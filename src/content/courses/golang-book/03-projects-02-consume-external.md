---
title: Consume external packages
description: Learn how to use external packages
lastmod: 2023-05-26T03:02:22.046Z
section: Projects
---

# Consume an external module

In this chapter, we are looking at downloading and using external modules.

## Introduction

This chapter will cover:

- Creating a project.
- Adding an external module to your project.
- Use the external library in your app.

## External module

To consume an external module, you need to:

- **Import it**, involves using the `import` instruction and fully qualifying the address to the module's location.
- **Use it in code**, call the code from the module that you mean to use
- **Ensure it's downloaded**, so your code can be run.

## Import module

To import a module, you can do one of two things:

- `go get <path to module>`, this will fetch the module and download it and make it available for your project to use.
- `go mod tidy`, this command checks the imports used in your program and fetches the module if not fetched already.

## Use it in code

To use your module in code, you need to add it to the `import` section and then invoke it where you need it in the application code.

```go
import (
  "github.com/<user>/<repo name>"
)

func main() {
  <repo name>.<Function>()
}
```

Here's an example:

```go
package main

import (
"fmt"
"github.com/softchris/math"
)

func main() {
  math.Add(1,1) // 2
}
```

## Assignment - consume an external module

Let's create a new project

1. Run `go mod init`:

   ```go
   go mod init hello
   ```

   Note how _go.mod_ was created with the following content:

   ```go
   module hello

   go 1.16
   ```

### Add reference to an external lib

Next, lets create some code that will use the external library:

1. Create the file _main.go_

   ```go
   package main

   import (
     "fmt"
     "github.com/softchris/math"
   )
   ```

1. To the same file, add a `main()` function and call the external `Add` method from the `math` package:

   ```go
   func main() {
     sum := math.Add(1,2)
     fmt.Println(sum)
   }
   ```

### Fetch the lib

Now, we need to resolve the external library.

1. Run `go mod tidy`:

   ```bash
   go mod tidy
   ```

   Your _go.mod_ is updated:

   ```go
   require github.com/softchris/math v0.2.0
   ```

   There's also _go.sum_ file with the following content:

   ```go
   github.com/softchris/math v0.2.0 h1:88L6PLRBGygS3LY5KGIJhyw9IZturmd2ksU+p13OPa4=

   github.com/softchris/math v0.2.0/go.mod h1:v8WzhjKC+ipuH+i9IZ0Ta2IArniTP53gc5TgCINCqAo=
   ```

   This is Go's way of keeping track of how to build the app by referencing to the go module in question.

1. Run `go run`:

   ```go
   go run main.go
   ```

   Running the program gives you the following output:

   ```output
   3
   ```

## Solution

go.sum

```go
github.com/softchris/math v0.2.0 h1:88L6PLRBGygS3LY5KGIJhyw9IZturmd2ksU+p13OPa4=
github.com/softchris/math v0.2.0/go.mod h1:v8WzhjKC+ipuH+i9IZ0Ta2IArniTP53gc5TgCINCqAo=

```

go.mod

```go
module hello

go 1.16

require github.com/softchris/math v0.2.0

```

main.go

```go
package main

import (
  "fmt"
  "github.com/softchris/math"
)

func main() {
  sum := math.Add(1,2)
  fmt.Println(sum)
}
```

## Challenge

See if you can find another module you want to use in your project. Add it to the project and use it in your code.
