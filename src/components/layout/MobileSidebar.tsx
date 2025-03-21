
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Sidebar from './Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 sm:max-w-xs">
        <SheetHeader className="p-4 border-b text-left">
          <SheetTitle>Hive</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full">
          <Sidebar isMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
