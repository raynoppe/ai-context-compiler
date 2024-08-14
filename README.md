# Directory Tree and Context File Generator for AI prompts
 
This Node.js script generates a directory tree structure and optionally creates a context document containing the contents of specified files. It provides an interactive command-line interface for customizing the output.

## Features

- Generate a tree structure of a specified directory
- Exclude specific folders (e.g., node_modules, dot folders)
- Exclude files with specific extensions
- Create a context document with the contents of specified file types
- Add a custom prefix to output file names
- Save output files in a dedicated 'output' folder

## Prerequisites

- Node.js installed on your system

## Installation

1. Clone this repository or download the `generate.js` file.
2. Open a terminal and navigate to the directory containing the script.

## Usage

1. Run the script using Node.js:

   ```
   node generate.js
   ```

2. Follow the prompts to configure the script:

   - Enter the folder to scan
   - Choose whether to exclude node_modules folder
   - Choose whether to exclude folders starting with a dot (.)
   - Enter additional folders to exclude (comma-separated)
   - Enter file extensions to exclude (comma-separated)
   - Choose whether to create a context document
   - Enter additional file extensions to include in the context document
   - Enter a prefix for output files (optional)

3. The script will generate the following files in the 'output' folder:
   - `[prefix]directory_tree.txt`: Contains the tree structure of the scanned directory
   - `[prefix]context_document.txt`: Contains the contents of included files (if enabled)

## Example

Here's an example of using the script:

```
$ node generate.js

Enter the folder to scan: /path/to/your/project
Exclude node_modules folder? (Y/n): Y
Exclude folders starting with a dot (.)? (Y/n): Y
Enter additional folders to exclude (comma-separated, press enter for none): build,dist
Enter file extensions to exclude (comma-separated, press enter for none): log,tmp
Create a context document? (Y/n): Y
Enter additional file extensions to include in the context document (comma-separated, default: js,jsx,ts,tsx,vue): md
Enter a prefix for output files (press enter for none): myproject_

Tree structure has been written to /path/to/script/output/myproject_directory_tree.txt
Context document has been written to /path/to/script/output/myproject_context_document.txt
```

## Output

### Directory Tree (`myproject_directory_tree.txt`)

The directory tree file will contain a representation of your project structure, like this:

```
.
└── project
    ├── src
    │   ├── components
    │   │   └── Header.js
    │   ├── pages
    │   │   └── Home.js
    │   └── App.js
    ├── public
    │   └── index.html
    └── package.json
```

### Context Document (`myproject_context_document.txt`)

The context document will contain the contents of the included files, each preceded by its relative path:

```
// src/components/Header.js
import React from 'react';

function Header() {
  return <header>Welcome to my app</header>;
}

export default Header;

// src/pages/Home.js
import React from 'react';

function Home() {
  return <div>Home Page</div>;
}

export default Home;

// ...
```

## Customization

You can modify the script to add more features or change the default behavior. Some possible extensions include:

- Adding options to sort files and folders
- Implementing depth limits for the directory tree
- Adding color coding to the tree structure
- Exporting the tree structure in different formats (e.g., JSON, XML)

Feel free to adapt the script to your specific needs!
