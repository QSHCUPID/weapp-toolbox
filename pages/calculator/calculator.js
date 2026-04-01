Page({
  data: {
    display: '0',
    formula: '',
    lastOperator: '',
    resetDisplay: false
  },

  appendNumber(e) {
    const num = e.currentTarget.dataset.num;
    let { display, resetDisplay } = this.data;
    
    if (resetDisplay) {
      display = '0';
      resetDisplay = false;
    }
    
    if (display === '0' && num !== '.') {
      display = num;
    } else {
      if (num === '.' && display.includes('.')) return;
      display += num;
    }
    
    this.setData({ display, resetDisplay });
  },

  appendOperator(e) {
    const operator = e.currentTarget.dataset.operator;
    let { display, formula, lastOperator, resetDisplay } = this.data;
    
    if (lastOperator && !resetDisplay) {
      this.calculate();
      display = this.data.display;
    }
    
    formula = display + ' ' + operator + ' ';
    lastOperator = operator;
    resetDisplay = true;
    
    this.setData({ formula, lastOperator, resetDisplay, display });
  },

  calculate() {
    let { display, formula, lastOperator } = this.data;
    if (!lastOperator || !formula) return;
    
    const prevNum = parseFloat(formula.split(' ')[0]);
    const currentNum = parseFloat(display);
    let result = 0;
    
    switch (lastOperator) {
      case '+':
        result = prevNum + currentNum;
        break;
      case '-':
        result = prevNum - currentNum;
        break;
      case '×':
        result = prevNum * currentNum;
        break;
      case '÷':
        if (currentNum === 0) {
          this.setData({ display: 'Error', formula: '', lastOperator: '', resetDisplay: true });
          return;
        }
        result = prevNum / currentNum;
        break;
    }
    
    result = Math.round(result * 100000000) / 100000000;
    this.setData({ 
      display: result.toString(), 
      formula: '', 
      lastOperator: '', 
      resetDisplay: true 
    });
  },

  clear() {
    this.setData({
      display: '0',
      formula: '',
      lastOperator: '',
      resetDisplay: false
    });
  },

  delete() {
    let { display, resetDisplay } = this.data;
    if (resetDisplay || display.length <= 1) {
      display = '0';
    } else {
      display = display.slice(0, -1);
    }
    this.setData({ display });
  }
})
