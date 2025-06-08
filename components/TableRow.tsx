import React from 'react'
import { TableCell, TableRow } from './ui/table'
import { Button } from './ui/button'
import { Id } from '@/types/Meal';

interface TableRowProps{
    mealName: string;
    mealIcon: string;
    mealType: string;
    createdAt: string;
    calories: string;
    protein: number | undefined;
    mealId: Id;
    handleDeleteFunction: (id: Id) => Promise<void>;
};

function TableRowComponent(props: TableRowProps) {
  return (
     <TableRow key={props.mealId.$oid} style={{ height: '50px' }}>
                      <TableCell className="font-medium">{props.mealName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>
                            {props.mealIcon}
                          </span>
                          <span className="capitalize">{props.mealType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{props.createdAt.slice(0,10)}</TableCell>
                      <TableCell>{props.calories} kcal</TableCell>
                      <TableCell>
                        {props.protein}
                        g
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs hover:cursor-pointer"
                          onClick={() => props.handleDeleteFunction(props.mealId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
  )
}

export default TableRowComponent;