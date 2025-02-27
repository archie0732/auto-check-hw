import RMarkdown from 'react-markdown';
import rehypeGithubAlert from 'rehype-github-alert';
import remarkGfm from 'remark-gfm';
import { twMerge } from 'tailwind-merge';

import { BlockQuote, Code, Heading1, Heading2, Heading3, Heading4, Link } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import type React from 'react';

export default function Markdown({ children }: React.ComponentPropsWithoutRef<typeof RMarkdown>) {
  return (
    <RMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeGithubAlert]}
      components={{
        h1({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { node: never }) {
          void node;
          return <Heading1 {...props} />;
        },
        h2({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { node: never }) {
          void node;
          return <Heading2 {...props} />;
        },
        h3({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { node: never }) {
          void node;
          return <Heading3 {...props} />;
        },
        h4({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { node: never }) {
          void node;
          return <Heading4 {...props} />;
        },
        hr({ node, className, ...props }: React.HTMLAttributes<HTMLHRElement> & { node: never }) {
          void node;
          return <Separator {...props} className={twMerge('my-2', className)} />;
        },
        div({ className, node, ...props }: React.HTMLAttributes<HTMLDivElement> & { node: never }) {
          const isAlert = className?.includes('markdown-alert');
          const alertType = isAlert
            ? className!.includes('-note')
              ? 'note'
              : className!.includes('-tip')
                ? 'tip'
                : className!.includes('-important')
                  ? 'important'
                  : className!.includes('-warning')
                    ? 'warning'
                    : 'caution'
            : '';
          void node;
          return (
            <div
              {...props}
              className={twMerge(
                isAlert && alertType && `
                  group/alert flex flex-col gap-2 border-l-4 py-2 pl-4
                  group/alert-${alertType}
                  ${{
              note: 'border-blue-500',
              tip: 'border-green-500',
              important: 'border-purple-500',
              warning: 'border-yellow-500',
              caution: 'border-red-500',
            }[alertType]}
                `,
                className?.includes('markdown-alert-tip') && `group/alert-tip`,
                className,
              )}
            />
          );
        },
        p({ className, node, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { node: never }) {
          void node;
          return (
            <p
              {...props}
              className={twMerge(`
                group-[>]/alert-caution:first:fill-red-500
                group-[>]/alert-caution:first:text-red-500
                group-[>]/alert-important:first:fill-purple-500
                group-[>]/alert-important:first:text-purple-500
                group-[>]/alert-note:first:fill-blue-500
                group-[>]/alert-note:first:text-blue-500
                group-[>]/alert-tip:first:fill-green-500
                group-[>]/alert-tip:first:text-green-500
                group-[>]/alert-warning:first:fill-yellow-500
                group-[>]/alert-warning:first:text-yellow-500
                group-[>]/alert:first:flex group-[>]/alert:first:items-center
                group-[>]/alert:first:gap-2 group-[>]/alert:first:font-bold
                group-[>]/md:leading-7 group-[>]/md:[&:not(:first-child)]:mt-4
              `, className)}
            />
          );
        },
        blockquote({ node, ...props }: React.HTMLAttributes<HTMLQuoteElement> & { node: never }) {
          void node;
          return <BlockQuote {...props} />;
        },
        code({ node, ...props }: React.HTMLAttributes<HTMLElement> & { node: never }) {
          void node;
          return <Code {...props} />;
        },
        img({ className, node, ...props }: React.HTMLAttributes<HTMLImageElement> & { node: never }) {
          void node;
          return (
          // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              className={twMerge(`rounded-md`, className)}
            />
          );
        },
        table({ className, node, ...props }: React.HTMLAttributes<HTMLTableElement> & { node: never }) {
          void node;
          return (
            <div className="my-2 block overflow-x-auto -mx-4 whitespace-nowrap">
              <Table
                {...props}
                className={twMerge(`
                  mx-4 my-4 table border-separate border-spacing-0
                  overflow-hidden rounded-lg border
                  md:inline-table md:w-auto
                `, className)}
              />
            </div>
          );
        },
        thead({ node, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { node: never }) {
          void node;
          return <TableHeader {...props} />;
        },
        tbody({ node, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { node: never }) {
          void node;
          return <TableBody {...props} />;
        },
        tr({ className, node, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { node: never }) {
          void node;
          return (
            <TableRow
              {...props}
              className={twMerge('group', className)}
            />
          );
        },
        th({ className, node, ...props }: React.HTMLAttributes<HTMLTableCellElement> & { node: never }) {
          void node;
          return (
            <TableHead
              {...props}
              className={twMerge(`border-b`, className)}
            />
          );
        },
        td({ className, node, ...props }: React.HTMLAttributes<HTMLTableCellElement> & { node: never }) {
          void node;
          return (
            <TableCell
              {...props}
              className={twMerge(`
                border-b
                group-last:border-b-0
              `, className)}
            />
          );
        },
        ul({ className, node, ...props }: React.HTMLAttributes<HTMLUListElement> & { node: never }) {
          void node;
          return (
            <ul
              {...props}
              className={twMerge(`
                ml-6
                [&:not(.contains-task-list)]:list-disc
                [&>li]:mt-2
                group-[>]/md:my-6
              `, className)}
            />
          );
        },
        ol({ className, node, ...props }: React.HTMLAttributes<HTMLOListElement> & { node: never }) {
          void node;
          return (
            <ol
              {...props}
              className={twMerge(`
                ml-6
                [&:not(.contains-task-list)]:list-decimal
                [&>li]:mt-2
                group-[>]/md:my-6
              `, className)}
            />
          );
        },
        a({ node, ...props }: React.ComponentProps<typeof Link> & { node: never }) {
          void node;
          return <Link {...props} />;
        },
        li({ className, node, ...props }: React.InputHTMLAttributes<HTMLLIElement> & { node: never }) {
          void node;
          return <li {...props} className={className} />;
        },
        input({ className, node, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { node: never }) {
          void node;
          return (
            props.type == 'checkbox'
              ? (
                  <Checkbox
                    checked={props.checked}
                    className="!cursor-default align-middle mr-2 disabled:opacity-100"
                    disabled
                  />
                )
              : <input {...props} className={className} />
          );
        },
      }}
    >
      {children}
    </RMarkdown>
  );
}