import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
  baseUrl: string
}

export function Pagination({ totalItems, currentPage, pageSize, baseUrl }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) {
    return null
  }

  // Create page numbers array
  const pageNumbers = []
  const maxPageButtons = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost")
    url.searchParams.set("page", page.toString())
    return `${url.pathname}${url.search}`
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-muted-foreground">
        Menampilkan {Math.min((currentPage - 1) * pageSize + 1, totalItems)} -{" "}
        {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} transaksi
      </div>
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <>
            <Link href={getPageUrl(1)}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">Halaman pertama</span>
              </Button>
            </Link>
            <Link href={getPageUrl(currentPage - 1)}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Halaman sebelumnya</span>
              </Button>
            </Link>
          </>
        )}

        {pageNumbers.map((page) => (
          <Link key={page} href={getPageUrl(page)}>
            <Button variant={page === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8">
              {page}
            </Button>
          </Link>
        ))}

        {currentPage < totalPages && (
          <>
            <Link href={getPageUrl(currentPage + 1)}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Halaman berikutnya</span>
              </Button>
            </Link>
            <Link href={getPageUrl(totalPages)}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Halaman terakhir</span>
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

