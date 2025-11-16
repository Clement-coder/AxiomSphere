'use client';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simulated data for search
const simulatedData = [
  { id: '1', type: 'Agent', name: 'Trading Bot', description: 'Autonomous trading agent' },
  { id: '2', type: 'Agent', name: 'Data Analyst', description: 'Real-time data analysis' },
  { id: '3', type: 'Rule', name: 'High Volume Alert', description: 'Notifies on high trading volume' },
  { id: '4', type: 'Transaction', name: 'USDC Transfer', description: 'Micropayment to agent' },
  { id: '5', type: 'Agent', name: 'Security Guard', description: 'Network monitoring agent' },
  { id: '6', type: 'Rule', name: 'Price Drop Alert', description: 'Notifies on significant price drops' },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const results = simulatedData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-20" onClick={onClose}>
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-lg p-4" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-input pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/50"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        {searchTerm && (
          <div className="mt-4 max-h-60 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No results found for "{searchTerm}"</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map(item => (
                  <div key={item.id} className="p-3 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors cursor-pointer">
                    <p className="text-sm font-medium">{item.name} <span className="text-xs text-primary">({item.type})</span></p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
