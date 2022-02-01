# Stack-based virtual machine

For using in "Compilation" subject (INSA).  
Live version: [https://edu-insa-4a-compilation-vm.netlify.app/](https://edu-insa-4a-compilation-vm.netlify.app/) 

## Structure

- `src/code/machine`: Machine + CPU model  
3 registers: BP, SP, IP  
state history (or `untick`)
- `src/code/memory`: Memory model  
ability to save `type` of data for debugging
- `src/code/program`: Program model  
ability to skip comment blocks (comments can start with any non-alphabetic characters like `;`, `#` or `//`)
ability translate label to address

## Author

This project is made by [ngxson](https://ngxson.com) 