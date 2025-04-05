import React from "react";
import { Resource } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import { BookOpen, FilePlus, Calendar, User } from "lucide-react";

interface ResourceCardProps {
  resource: Resource & { authorName: string };
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "guides":
        return "bg-blue-100 text-blue-800";
      case "tutorials":
        return "bg-green-100 text-green-800";
      case "best practices":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "guides":
        return <BookOpen className="h-4 w-4 mr-1" />;
      case "tutorials":
        return <FilePlus className="h-4 w-4 mr-1" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={`flex items-center ${getCategoryColor(resource.category)}`}>
            {getCategoryIcon(resource.category)}
            {resource.category}
          </Badge>
          <div className="text-xs text-neutral-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(resource.createdAt)}
          </div>
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-neutral-700 line-clamp-4 text-sm">
          {resource.content.length > 300 
            ? `${resource.content.substring(0, 300)}...` 
            : resource.content}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2">
            <span className="text-xs font-medium">{getInitials(resource.authorName)}</span>
          </div>
          <span className="text-sm text-neutral-600">{resource.authorName}</span>
        </div>
        <Button variant="outline" size="sm">Read More</Button>
      </CardFooter>
    </Card>
  );
}
