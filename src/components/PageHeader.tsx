import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  onBack,
  actions
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-cyan-500/10 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {Icon && (
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-75"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-xl">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
            <h2 className="text-gradient">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground ml-14">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};
