import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';

/**
 * RenderBoundary - Creates an isolated render context
 * 
 * This context ensures that state changes within one branch of the tree
 * don't trigger re-renders in sibling branches.
 * 
 * Based on Steve Kinney's principle: "Put state in the right place so it's 
 * not triggering stuff in parts of the tree that don't care"
 */

interface RenderBoundaryContextValue {
  version: number;
}

const RenderBoundaryContext = createContext<RenderBoundaryContextValue>({ version: 0 });

export const RenderBoundaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const versionRef = useRef(0);
  
  return (
    <RenderBoundaryContext.Provider value={{ version: versionRef.current }}>
      {children}
    </RenderBoundaryContext.Provider>
  );
};

export const useRenderBoundary = () => useContext(RenderBoundaryContext);
