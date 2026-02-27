import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState('');
  const [operation, setOperation] = useState(null);
  const [shouldResetScreen, setShouldResetScreen] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isScientific, setIsScientific] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Toggle mode
  const toggleMode = (mode) => {
    setIsScientific(mode === 'scientific');
    setShowMenu(false);
  };

  const [memory, setMemory] = useState(0);

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleScientific = (func) => {
    const current = parseFloat(currentValue);
    if (isNaN(current)) return;

    let res;
    switch (func) {
      case 'sin': res = Math.sin(current); break;
      case 'cos': res = Math.cos(current); break;
      case 'tan': res = Math.tan(current); break;
      case 'sinh': res = Math.sinh(current); break;
      case 'cosh': res = Math.cosh(current); break;
      case 'tanh': res = Math.tanh(current); break;
      case 'ln': res = Math.log(current); break;
      case 'log10': res = Math.log10(current); break;
      case 'x^2': res = Math.pow(current, 2); break;
      case 'x^3': res = Math.pow(current, 3); break;
      case 'e^x': res = Math.exp(current); break;
      case '10^x': res = Math.pow(10, current); break;
      case '1/x': res = 1 / current; break;
      case 'sqrt': res = Math.sqrt(current); break;
      case 'cbrt': res = Math.cbrt(current); break;
      case 'x!': res = factorial(current); break;
      case 'rand': res = Math.random(); break;
      case 'pi': res = Math.PI; break;
      case 'e': res = Math.E; break;
      case '+/-': res = -current; break;
      default: return;
    }

    setCurrentValue(res.toString());
    setShouldResetScreen(true);
  };

  const handleMemory = (op) => {
    const current = parseFloat(currentValue);
    switch (op) {
      case 'mc': setMemory(0); break;
      case 'm+': setMemory(memory + current); break;
      case 'm-': setMemory(memory - current); break;
      case 'mr': setCurrentValue(memory.toString()); break;
      default: break;
    }
    setShouldResetScreen(true);
  };

  const clear = () => {
    setCurrentValue('0');
    setPreviousValue('');
    setOperation(null);
  };

  const deleteNumber = () => {
    if (shouldResetScreen) return;
    if (currentValue.length === 1) {
      setCurrentValue('0');
    } else {
      setCurrentValue(currentValue.toString().slice(0, -1));
    }
  };

  const appendNumber = (number) => {
    if (number === '.' && currentValue.includes('.')) return;
    if (shouldResetScreen || currentValue === '0') {
      setCurrentValue(number === '.' ? '0.' : number);
      setShouldResetScreen(false);
    } else {
      setCurrentValue(currentValue + number);
    }
  };

  const chooseOperation = (op) => {
    if (currentValue === '') return;
    if (previousValue !== '') {
      compute();
    }
    setOperation(op);
    setPreviousValue(currentValue);
    setShouldResetScreen(true);
  };

  const compute = () => {
    let computation;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          alert("Cannot divide by zero");
          clear();
          return;
        }
        computation = prev / current;
        break;
      case '^':
        computation = Math.pow(prev, current);
        break;
      case 'yroot':
        computation = Math.pow(prev, 1 / current);
        break;
      default:
        return;
    }

    setCurrentValue(computation.toString());
    setHistory(prevHistory => [
      {
        previous: previousValue,
        operation: operation,
        current: currentValue,
        result: computation.toString()
      },
      ...prevHistory
    ].slice(0, 10)); // Keep last 10 calculations
    setOperation(null);
    setPreviousValue('');
    setShouldResetScreen(true);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleEquals = () => {
    compute();
  };

  const handlePercentage = () => {
    const current = parseFloat(currentValue);
    if (isNaN(current)) return;
    setCurrentValue((current / 100).toString());
    setShouldResetScreen(true);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
      if (e.key === '.') appendNumber('.');
      if (e.key === '=' || e.key === 'Enter') handleEquals();
      if (e.key === 'Backspace') deleteNumber();
      if (e.key === 'Escape') clear();
      if (e.key === '+') chooseOperation('+');
      if (e.key === '-') chooseOperation('-');
      if (e.key === '*') chooseOperation('*');
      if (e.key === '/') chooseOperation('÷');
      if (e.key === '%') handlePercentage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentValue, previousValue, operation]);

  return (
    <div className="mobile-app-container">
      <header className="mobile-header">
        <div className="header-content">
          <h1>DailyCalc</h1>
          <span className="status-badge">Professional</span>
        </div>
      </header>

      <main className={`mobile-calculator ${isScientific ? 'scientific-mode' : 'basic-mode'}`}>
        <div className="display">
          <button
            className="history-icon-btn"
            onClick={() => setShowHistory(!showHistory)}
            title="Toggle History"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>

          <button
            className="menu-icon-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="Switch Mode"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </button>

          {!showHistory && (
            <>
              <div className="previous-operand">
                {previousValue} {operation}
              </div>
              <div className="current-operand">{currentValue}</div>
            </>
          )}
        </div>

        {showMenu && (
          <div className="mode-menu">
            <button className={`menu-item ${!isScientific ? 'active' : ''}`} onClick={() => toggleMode('basic')}>
              <span className="icon">± ÷</span>
              <span>Basic</span>
              {!isScientific && <span className="check">✓</span>}
            </button>
            <button className={`menu-item ${isScientific ? 'active' : ''}`} onClick={() => toggleMode('scientific')}>
              <span className="icon">f(x)</span>
              <span>Scientific</span>
              {isScientific && <span className="check">✓</span>}
            </button>
          </div>
        )}

        <div className={`buttons-grid ${isScientific ? 'scientific-active' : ''}`}>
          {isScientific && (
            <div className="scientific-controls">
              <button className="sci-btn" onClick={() => appendNumber('(')}>(</button>
              <button className="sci-btn" onClick={() => appendNumber(')')}>)</button>
              <button className="sci-btn" onClick={() => handleMemory('mc')}>mc</button>
              <button className="sci-btn" onClick={() => handleMemory('m+')}>m+</button>
              <button className="sci-btn" onClick={() => handleMemory('m-')}>m-</button>
              <button className="sci-btn" onClick={() => handleMemory('mr')}>mr</button>

              <button className="sci-btn">2<sup>nd</sup></button>
              <button className="sci-btn" onClick={() => handleScientific('x^2')}>x<sup>2</sup></button>
              <button className="sci-btn" onClick={() => handleScientific('x^3')}>x<sup>3</sup></button>
              <button className="sci-btn" onClick={() => chooseOperation('^')}>x<sup>y</sup></button>
              <button className="sci-btn" onClick={() => handleScientific('e^x')}>e<sup>x</sup></button>
              <button className="sci-btn" onClick={() => handleScientific('10^x')}>10<sup>x</sup></button>

              <button className="sci-btn" onClick={() => handleScientific('1/x')}><sup>1</sup>/<sub>x</sub></button>
              <button className="sci-btn" onClick={() => handleScientific('sqrt')}><sup>2</sup>√x</button>
              <button className="sci-btn" onClick={() => handleScientific('cbrt')}><sup>3</sup>√x</button>
              <button className="sci-btn" onClick={() => chooseOperation('yroot')}><sup>y</sup>√x</button>
              <button className="sci-btn" onClick={() => handleScientific('ln')}>ln</button>
              <button className="sci-btn" onClick={() => handleScientific('log10')}>log<sub>10</sub></button>

              <button className="sci-btn" onClick={() => handleScientific('x!')}>x!</button>
              <button className="sci-btn" onClick={() => handleScientific('sin')}>sin</button>
              <button className="sci-btn" onClick={() => handleScientific('cos')}>cos</button>
              <button className="sci-btn" onClick={() => handleScientific('tan')}>tan</button>
              <button className="sci-btn" onClick={() => handleScientific('e')}>e</button>
              <button className="sci-btn">EE</button>

              <button className="sci-btn" onClick={() => handleScientific('rand')}>Rand</button>
              <button className="sci-btn" onClick={() => handleScientific('sinh')}>sinh</button>
              <button className="sci-btn" onClick={() => handleScientific('cosh')}>cosh</button>
              <button className="sci-btn" onClick={() => handleScientific('tanh')}>tanh</button>
              <button className="sci-btn" onClick={() => handleScientific('pi')}>π</button>
              <button className="sci-btn">Rad</button>
            </div>
          )}

          <div className="standard-controls">
            <button className="delete" onClick={deleteNumber}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                <line x1="18" y1="9" x2="12" y2="15"></line>
                <line x1="12" y1="9" x2="18" y2="15"></line>
              </svg>
            </button>
            <button className="clear" onClick={clear}>AC</button>
            <button className="operator" onClick={handlePercentage}>%</button>
            <button className="operator" onClick={() => chooseOperation('÷')}>÷</button>

            <button onClick={() => appendNumber('7')}>7</button>
            <button onClick={() => appendNumber('8')}>8</button>
            <button onClick={() => appendNumber('9')}>9</button>
            <button className="operator" onClick={() => chooseOperation('*')}>×</button>

            <button onClick={() => appendNumber('4')}>4</button>
            <button onClick={() => appendNumber('5')}>5</button>
            <button onClick={() => appendNumber('6')}>6</button>
            <button className="operator" onClick={() => chooseOperation('-')}>−</button>

            <button onClick={() => appendNumber('1')}>1</button>
            <button onClick={() => appendNumber('2')}>2</button>
            <button onClick={() => appendNumber('3')}>3</button>
            <button className="operator" onClick={() => chooseOperation('+')}>+</button>

            <button onClick={() => handleScientific('+/-')}>+/-</button>
            <button onClick={() => appendNumber('0')}>0</button>
            <button onClick={() => appendNumber('.')}>.</button>
            <button className="equals" onClick={handleEquals}>=</button>
          </div>
        </div>

        {showHistory && (
          <div className="history-sheet">
            <div className="sheet-handle"></div>
            <div className="sheet-header">
              <button className="edit-btn">Edit</button>
              <button className="close-btn" onClick={() => setShowHistory(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="history-list-sheet">
              <div className="history-group">
                <h4>Recent</h4>
                {history.length === 0 ? (
                  <p className="no-history-text">No History</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="history-item-sheet">
                      <span className="math">{item.previous}{item.operation}{item.current}</span>
                      <span className="res">{item.result}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Calculator;
