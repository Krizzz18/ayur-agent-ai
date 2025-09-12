import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Sun, Moon, Leaf, TreePine, Sunset } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme, themes } = useTheme();

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'ayur-classic':
        return <Leaf className="w-4 h-4" />;
      case 'ayur-forest':
        return <TreePine className="w-4 h-4" />;
      case 'ayur-sunset':
        return <Sunset className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
          {getThemeIcon(theme)}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center gap-3 p-3 cursor-pointer ${
              theme === themeOption.value ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              {getThemeIcon(themeOption.value)}
              <div className="flex flex-col">
                <span className="font-medium">{themeOption.label}</span>
                <span className="text-xs text-muted-foreground">{themeOption.description}</span>
              </div>
            </div>
            {theme === themeOption.value && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;