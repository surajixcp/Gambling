
import React, { useState } from 'react';
import { Screen, UserData, Transaction, Market, Notice, DeclaredResult, Role, WithdrawalRequest, Bid } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UsersScreen from './screens/UsersScreen';
import MarketsScreen from './screens/MarketsScreen';
import ResultsScreen from './screens/ResultsScreen';
import BidsScreen from './screens/BidsScreen';
import WithdrawalsScreen from './screens/WithdrawalsScreen';
import FinanceScreen from './screens/FinanceScreen';
import NoticesScreen from './screens/NoticesScreen';
import SettingsScreen from './screens/SettingsScreen';
import RolesScreen from './screens/RolesScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import Layout from './components/Layout';

// Initial seed data
const INITIAL_USERS: UserData[] = Array.from({ length: 45 }, (_, i) => ({
  id: `#BT-${25000 + i}`,
  name: `User_${1000 + i}${i % 3 === 0 ? ' Kumar' : i % 5 === 0 ? ' Singh' : ''}`,
  phone: `+91 ${90000 + i} ${12340 + i}`,
  balance: Math.floor(Math.random() * 50000),
  status: i % 7 === 0 ? 'blocked' : 'active',
  joinedAt: new Date(Date.now() - (i * 86400000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
}));

const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  id: `TXN-${99000 + i}`,
  user: INITIAL_USERS[i % INITIAL_USERS.length].name,
  userId: INITIAL_USERS[i % INITIAL_USERS.length].id,
  type: i % 3 === 0 ? 'withdrawal' : i % 3 === 1 ? 'deposit' : 'bet',
  amount: Math.floor(Math.random() * 10000) + 500,
  date: new Date(Date.now() - (i * 3600000)).toLocaleString(),
  status: i % 5 === 0 ? 'pending' : i % 8 === 0 ? 'failed' : 'success',
  method: i % 2 === 0 ? 'UPI - PhonePe' : 'Bank Transfer'
}));

const INITIAL_MARKETS: Market[] = [
  { id: '1', name: 'DELHI NIGHT', openTime: '08:30 PM', closeTime: '09:30 PM', status: 'Open', type: 'starline' },
  { id: '2', name: 'KALYAN STARLINE', openTime: '10:00 AM', closeTime: '11:00 AM', status: 'Closed', type: 'starline' },
  { id: '3', name: 'MILAN MORNING', openTime: '11:15 AM', closeTime: '12:15 PM', status: 'Suspended', type: 'starline' },
  { id: '4', name: 'SUPREME DAY', openTime: '01:30 PM', closeTime: '02:30 PM', status: 'Open', type: 'starline' },
  { id: '5', name: 'RAJDHANI NIGHT', openTime: '09:45 PM', closeTime: '10:45 PM', status: 'Open', type: 'starline' },
  { id: '6', name: 'KING JACKPOT', openTime: '12:00 PM', closeTime: '01:00 PM', status: 'Open', type: 'jackpot' },
];

const INITIAL_NOTICES: Notice[] = [
  { id: '1', title: 'Server Maintenance', message: 'System will be offline on Sunday 2AM to 4AM for scheduled database optimization.', date: 'Oct 24, 2024', active: true },
  { id: '2', title: 'Happy Diwali Bonus', message: 'Celebrate with 10% extra on every deposit this week! Offer valid till midnight.', date: 'Oct 20, 2024', active: false },
  { id: '3', title: 'New Market Added', message: 'Check out the new Starline Jackpot market now live in the markets section.', date: 'Oct 15, 2024', active: true },
];

const INITIAL_RESULTS: DeclaredResult[] = [
  { id: '1', game: 'Kalyan Starline', session: 'Open', panna: '140', single: '5', declaredBy: 'Super Admin', timestamp: '10 min ago' },
  { id: '2', game: 'Milan Day', session: 'Close', panna: '379', single: '9', declaredBy: 'Admin_2', timestamp: '1 hour ago' },
  { id: '3', game: 'Rajdhani Night', session: 'Open', panna: '246', single: '2', declaredBy: 'Admin_1', timestamp: '4 hours ago' },
];

const INITIAL_ROLES: Role[] = [
  { id: '1', name: 'Super Admin', description: 'Complete access to all system modules and settings.', level: 'Full Access', users: 2, permissions: ['View List', 'Edit Balance', 'Block Users', 'Delete Accounts', 'View Full Profile', 'Add Markets', 'Delete Markets', 'Suspend Market', 'Edit Timings', 'View Bids', 'Approve Withdrawals', 'Export Reports', 'Manual Entry', 'View Ledger', 'Refund Transactions', 'Change App Version', 'Branding', 'Edit Roles', 'Clear Logs', 'Post Notices'] },
  { id: '2', name: 'Accounts Manager', description: 'Handles financial transactions, withdrawals, and ledger reports.', level: 'Finance Only', users: 3, permissions: ['Approve Withdrawals', 'View Ledger', 'Export Reports'] },
  { id: '3', name: 'Game Operator', description: 'Responsible for market timings, bid monitoring, and results.', level: 'Markets & Results', users: 5, permissions: ['Suspend Market', 'Edit Timings', 'View Bids'] },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  { 
    id: 'WTH-8820', 
    userName: 'Harish Kumar', 
    userId: '#BT-25000', 
    amount: 5000, 
    method: 'UPI', 
    details: { upiId: 'kumarh@okaxis', holderName: 'Harish Kumar' },
    requestedAt: '2024-03-24 04:20 PM', 
    status: 'pending' 
  },
  { 
    id: 'WTH-8821', 
    userName: 'Rakesh Singh', 
    userId: '#BT-25005', 
    amount: 12500, 
    method: 'Bank Transfer', 
    details: { bankName: 'HDFC Bank', accountNo: '0023456789', ifsc: 'HDFC0000234', holderName: 'Rakesh Singh' },
    requestedAt: '2024-03-24 02:15 PM', 
    status: 'pending' 
  },
];

const INITIAL_BIDS: Bid[] = [
  { id: 'BID-1001', userName: 'User_1000 Kumar', userId: '#BT-25000', gameName: 'Kalyan Night', marketType: 'Single Digit', session: 'OPEN', digits: '5', amount: 200, multiplier: 9, timestamp: '10:15:30 PM', date: '2024-03-20' },
  { id: 'BID-1002', userName: 'User_1001', userId: '#BT-25001', gameName: 'Milan Day', marketType: 'Jodi', session: 'OPEN', digits: '45', amount: 500, multiplier: 90, timestamp: '11:20:15 AM', date: '2024-03-20' },
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Global Shared States
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [results, setResults] = useState<DeclaredResult[]>(INITIAL_RESULTS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen(Screen.LOGIN);
  };

  const navigateToUser = (id: string) => {
    setSelectedUserId(id);
    setCurrentScreen(Screen.USER_PROFILE);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.DASHBOARD:
        return <DashboardScreen users={users} transactions={transactions} onNavigate={setCurrentScreen} />;
      case Screen.USERS:
        return <UsersScreen 
          users={users} 
          setUsers={setUsers} 
          setTransactions={setTransactions}
          onViewUser={navigateToUser} 
        />;
      case Screen.USER_PROFILE:
        const selectedUser = users.find(u => u.id === selectedUserId);
        return <UserProfileScreen 
          user={selectedUser || users[0]} 
          transactions={transactions}
          setTransactions={setTransactions}
          onUpdateUser={(updated) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))}
          onBack={() => setCurrentScreen(Screen.USERS)} 
        />;
      case Screen.MARKETS:
        return <MarketsScreen markets={markets} setMarkets={setMarkets} />;
      case Screen.RESULTS:
        return <ResultsScreen history={results} setHistory={setResults} />;
      case Screen.BIDS:
        return <BidsScreen bids={bids} setBids={setBids} />;
      case Screen.WITHDRAWALS:
        return <WithdrawalsScreen withdrawals={withdrawals} setWithdrawals={setWithdrawals} />;
      case Screen.FINANCE:
        return <FinanceScreen transactions={transactions} setTransactions={setTransactions} />;
      case Screen.NOTICES:
        return <NoticesScreen notices={notices} setNotices={setNotices} />;
      case Screen.SETTINGS:
        return <SettingsScreen />;
      case Screen.ROLES:
        return <RolesScreen roles={roles} setRoles={setRoles} />;
      default:
        return <DashboardScreen users={users} transactions={transactions} onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <Layout activeScreen={currentScreen} onNavigate={setCurrentScreen} onLogout={handleLogout}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
