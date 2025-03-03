import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Shield, Check, Eye, EyeOff } from 'lucide-react';

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState(0);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateStrength = () => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (length > 8) score += 1;
    if (length > 12) score += 1;
    if (length > 16) score += 1;
    
    // Character variety check
    if (includeUppercase && /[A-Z]/.test(password)) score += 1;
    if (includeLowercase && /[a-z]/.test(password)) score += 1;
    if (includeNumbers && /[0-9]/.test(password)) score += 1;
    if (includeSymbols && /[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 5);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    setStrength(calculateStrength());
  }, [password]);

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Очень слабый';
      case 1: return 'Слабый';
      case 2: return 'Средний';
      case 3: return 'Хороший';
      case 4: return 'Сильный';
      case 5: return 'Очень сильный';
      default: return '';
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Генератор паролей</h1>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 pr-12">
            <div className={`font-mono text-lg ${showPassword ? 'text-gray-800' : 'text-transparent select-none bg-gray-400'} ${showPassword ? '' : 'user-select-none'}`} style={!showPassword ? {textShadow: '0 0 8px currentColor'} : {}}>
              {password || 'Нажмите кнопку для генерации'}
            </div>
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-12 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button 
              onClick={copyToClipboard}
              className="absolute right-3 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={!password}
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">Длина пароля: {length}</label>
            </div>
            <input 
              type="range" 
              min="4" 
              max="32" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span>12</span>
              <span>20</span>
              <span>32</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Настройки пароля</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="uppercase" 
                  checked={includeUppercase} 
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="uppercase" className="text-sm text-gray-700">Заглавные буквы</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="lowercase" 
                  checked={includeLowercase} 
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="lowercase" className="text-sm text-gray-700">Строчные буквы</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="numbers" 
                  checked={includeNumbers} 
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="numbers" className="text-sm text-gray-700">Цифры</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="symbols" 
                  checked={includeSymbols} 
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="symbols" className="text-sm text-gray-700">Символы</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Надежность пароля</label>
              <span className="text-sm font-medium" style={{color: strength > 3 ? '#10B981' : strength > 1 ? '#F59E0B' : '#EF4444'}}>
                {getStrengthLabel()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={generatePassword}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <RefreshCw size={18} />
          <span>Сгенерировать новый пароль</span>
        </button>
        
        <p className="text-xs text-center text-gray-500">
          Надежные пароли должны содержать комбинацию букв, цифр и символов.
        </p>
      </div>
    </div>
  );
}

export default App;
