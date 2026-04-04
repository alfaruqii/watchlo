"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ModalDocs = () => {
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage when component mounts
    const storedValue = localStorage.getItem("dontAskAgain");
    const shouldNotShow = JSON.parse(storedValue || "false");
    setDontAskAgain(shouldNotShow);

    // Show modal only on root path and when shouldNotShow is false
    if (pathname === "/" && !shouldNotShow) {
      setIsOpen(true);
    } else {
      // Close modal on any other path
      setIsOpen(false);
    }
  }, [pathname]); // This effect runs whenever pathname changes

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = () => {
    const newState = !dontAskAgain;
    setDontAskAgain(newState);
    localStorage.setItem('dontAskAgain', JSON.stringify(newState));
  };

  // Rest of the component remains the same...
  const CheckboxComponent = ({ className = "" }) => (
    <div className={`w-fit ${className}`}>
      <div className="flex items-center gap-2 pt-0">
        <Checkbox checked={dontAskAgain} onCheckedChange={handleCheckboxChange} id="dont-ask-again" />
        <Label htmlFor="dont-ask-again">Don&apos;t ask me again</Label>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && pathname === "/" && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className={`border ${theme === "garden" ? "border-gray-700/60" : "border-gray-600/80"} rounded shadow-lg`}>
            <DialogTitle className="sr-only">Warning</DialogTitle>
            <DialogDescription className="sr-only">Read docs before playing for the best experience.</DialogDescription>
            {/* Modal content remains the same */}
            <div className="flex gap-4">
              <div className="w-32">
                <Image alt="Warning Emoji" src="/warning-emoji.webp" width={100} height={100} />
              </div>
              <div>
                <h3 className="-mt-2 font-bold text-warning sm:text-lg">WARNING</h3>
                <p className="pb-1 text-sm sm:text-base text-balance">
                  For best experience please read the <Link href="/docs" className="underline underline-offset-2">docs</Link> first before playing
                </p>
                <CheckboxComponent className="hidden sm:block" />
              </div>
            </div>
            <DialogFooter className="mt-0.5 items-center justify-between sm:justify-end">
              <CheckboxComponent className="block sm:hidden" />
              <Button variant="secondary" size="sm" onClick={closeModal}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ModalDocs;
