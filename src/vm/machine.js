import Memory, { DATA_TYPE_INSTR_ADDR, DATA_TYPE_INT, DATA_TYPE_MEM_ADDR, VALUE_DUMMY } from "./memory";
import Program from "./program";

class Machine {
  bp = 0; // base pointer
  sp = 0; // stack pointer
  ip = 0; // instruction pointer
  clk = 0; // clock clount
  memory = new Memory();
  program = new Program();
  history = []; // list of snapshots
  screen = ''; // output console buffer

  boot(assemblyCode) {
    this.program.loadProgram(assemblyCode, this.instruction);
    this.memory.setData(0, VALUE_DUMMY);
  }

  tick = (skipBreakpoint) => {
    // load the instruction
    const instruction = this.program.getInstruction(this.ip);
    console.log(instruction);
    if (!instruction) throw new Error('Program ended');
    // check breakpoint
    if (!skipBreakpoint && instruction.breakpoint) {
      throw new Error('Breakpoint');
    }
    // execute the instruction
    this._takeSnapshot();
    const {opcode, value} = instruction;
    try {
      this.instruction[opcode](value);
    } catch (e) {
      this.history.pop();
      throw e;
    }
    this.ip++;
    this.clk++;
  }

  // go back to last state
  untick = () => {
    const snapshot = this.history.pop();
    if (!snapshot) throw new Error('No previous state');
    this.bp = snapshot.bp;
    this.sp = snapshot.sp;
    this.ip = snapshot.ip;
    this.memory = snapshot.memory;
    this.clk = snapshot.clk;
    this.screen = snapshot.scren;
  }

  _getXY = () => {
    const {value: y} = this.memory.getData(this.sp);
    this.memory.erase(this.sp);
    this.sp--;
    const {value: x} = this.memory.getData(this.sp);
    return {x, y};
  }

  _getSlotAddr = (slot) => {
    return this.bp + 1 + slot;
  }

  _takeSnapshot = () => {
    const snapshot = {
      bp: this.bp,
      sp: this.sp,
      ip: this.ip,
      clk: this.clk,
      screen: this.screen,
      memory: this.memory.clone(),
    };
    this.history.push(snapshot);
  }

  _checkLabelExist = (label) => {
    const addr = this.program.labelToInstructionAddress(label);
    if (addr === undefined) {
      throw new Error(`jmp: label name "${label}" not found`);
    }
  }

  _popStack = () => {
    const v = this.memory.getData(this.sp);
    this.memory.erase(this.sp);
    this.sp--;
    return v;
  }

  _internalFunction = (label) => {
    console.log(label)
    if (label === 'print_int') {
      const {value} = this._popStack();
      this.screen += `${value}`;
      return true;
    } else if (label === 'print_newline') {
      this.screen += '\n';
      return true;
    }
    return false;
  }

  instruction = {
    // memory
    push: (slot) => {
      const slotAddr = this._getSlotAddr(slot);
      const {value} = this.memory.getData(slotAddr);
      this.instruction.mpush(value);
    },
    mpush: (imm, type=DATA_TYPE_INT) => {
      // type is for debugging
      this.sp++;
      this.memory.setData(this.sp, imm, type);
    },
    pop: (slot) => {
      const {value, type} = this.memory.getData(this.sp);
      const slotAddr = this._getSlotAddr(slot);
      this.memory.setData(slotAddr, value, type);
      this.memory.erase(this.sp);
      this.sp--;
    },

    // arithmetic
    add: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x+y);
    },
    sub: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x-y);
    },
    mul: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x*y);
    },
    div: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x/y);
    },

    // conditions
    testg: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x>y ? 1 : 0);
    },
    testne: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x!==y ? 1 : 0);
    },
    teste: () => {
      const {x, y} = this._getXY();
      this.memory.setData(this.sp, x===y ? 1 : 0);
    },

    // jumps
    //label: (label) => {},
    jz: (label) => {
      this._checkLabelExist(label);
      const {value} = this.memory.getData(this.sp);
      this.memory.erase(this.sp);
      this.sp--;
      if (value === 0)
        this.instruction.jmp(label);
    },
    jmp: (label) => {
      const addr = this.program.labelToInstructionAddress(label);
      if (addr === undefined) {
        throw new Error(`jmp: label name "${label}" not found`);
      }
      this.ip = addr;
    },

    //stop: (label) => {},

    // alloc/free
    alloc: (size) => {
      for (let i = 0; i < size; i++) {
        this.sp++;
        this.memory.setData(this.sp, 0);
      }
    },
    free: () => {
      for (let i = this.sp; i > this.bp; i--) {
        this.memory.erase(i);
        this.sp--;
      }
    },

    // call/ret
    call: (label) => {
      if (this._internalFunction(label)) return;
      this._checkLabelExist(label);
      this.instruction.mpush(this.ip, DATA_TYPE_INSTR_ADDR);
      this.instruction.mpush(this.bp, DATA_TYPE_MEM_ADDR);
      this.instruction.jmp(label);
      this.bp = this.sp;
    },
    ret: (n) => {
      const {value: oldBP} = this._popStack();
      this.bp = oldBP;
      const {value: returnAddr} = this._popStack();
      this.ip = returnAddr;
      for (let i = 0; i < n; i++) {
        this.memory.erase(this.sp);
        this.sp--;
      }
    },
    iret: (n) => {
      const {value: returnValue} = this._popStack();
      this.instruction.ret(n);
      this.instruction.mpush(returnValue);
    },
  };
}

export default Machine;