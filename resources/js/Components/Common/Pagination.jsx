"use client"

import { Link } from "@inertiajs/react"
import React, { useEffect } from "react"
import { Row } from "reactstrap"

const Paginations = ({
  perPageData,
  data,
  currentPage,
  setCurrentPage,
  isShowingPageLength,
  paginationDiv,
  paginationClass,
}) => {
  //pagination
  const handleClick = (e) => {
    e.preventDefault()
    setCurrentPage(Number(e.target.id))
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
    pageNumbers.push(i)
  }

  const handleprevPage = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      const prevPage = currentPage - 1
      setCurrentPage(prevPage)
    }
  }

  const handlenextPage = (event) => {
    event.preventDefault()
    if (currentPage < pageNumbers.length) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
    }
  }

  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length)
    }
  }, [pageNumbers.length, currentPage, setCurrentPage])

  return (
    <React.Fragment>
      <Row className="justify-content-between align-items-center">
        {isShowingPageLength && (
          <div className="col-sm">
            <div className="text-muted">
              Showing <span className="fw-semibold">{Math.min(perPageData, data?.length)}</span> of{" "}
              <span className="fw-semibold">{data?.length}</span> entries
            </div>
          </div>
        )}
        <div className={paginationDiv}>
          <ul className={paginationClass}>
            <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
              <Link href="#" className="page-link" onClick={handleprevPage}>
                <i className="mdi mdi-chevron-left"></i>
              </Link>
            </li>
            {(pageNumbers || []).map((item, index) => (
              <li className={currentPage === item ? "page-item active " : "page-item"} key={index}>
                <Link href="#" className="page-link" id={item} onClick={handleClick}>
                  {item}
                </Link>
              </li>
            ))}
            <li className={`page-item ${currentPage >= pageNumbers.length ? "disabled" : ""}`}>
              <Link href="#" className="page-link" onClick={handlenextPage}>
                <i className="mdi mdi-chevron-right"></i>
              </Link>
            </li>
          </ul>
        </div>
      </Row>
    </React.Fragment>
  )
}

export default Paginations
