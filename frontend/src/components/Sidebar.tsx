import { cn } from '@/lib/utils';
import { Brain, FileText, Hash, Link2, Youtube, Twitter } from 'lucide-react'
import { NavLink } from 'react-router-dom';


const sidebarItems = [
    { icon: Twitter, label: 'Tweets' },
    { icon: Youtube, label: 'Videos' },
    { icon: FileText, label: 'Documents' },
    { icon: Link2, label: 'Links' },
    { icon: Hash, label: 'Tags' },
  ];

const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-card px-3 py-4">
      <div className="flex items-center gap-2 px-4 mb-8">
        <Brain className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold">Second Brain</span>
      </div>
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.label}
            to={`/${item.label.toLowerCase()}`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar