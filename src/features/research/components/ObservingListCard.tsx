"use client";

import React from "react";
import Link from "next/link";
import { ObservingList } from "@/domain/research/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";

interface ObservingListCardProps {
  list: ObservingList;
  onDelete?: (id: string) => void;
}

export const ObservingListCard: React.FC<ObservingListCardProps> = ({ list, onDelete }) => {
  return (
    <div className="p-4 rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 hover:bg-celestial-surface/80 transition space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-celestial-cyan uppercase tracking-wider">
          {list.name}
        </span>
        <Badge variant="outline" className="text-[10px] font-mono">
          {list.targetSlugs.length} Targets
        </Badge>
      </div>

      <p className="text-xs text-celestial-subtle line-clamp-2">{list.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-celestial-muted/40">
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 font-mono">
          <Link href={`/sky/planner?list=${list.id}`}>
            Plan Sequence <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>

        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
            onClick={() => onDelete(list.id)}
            aria-label="Delete observing list"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
