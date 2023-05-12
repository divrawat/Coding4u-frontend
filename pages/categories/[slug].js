import Head from 'next/head';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/Layout'), {ssr: false});
import { singleCategory } from '../../actions/category';
import { DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import Card from '../../components/blog/Card';
import styles from "../../styles/blogs.module.css"
import Search from '@/components/blog/Search';
import { useState } from 'react';

const Category = ({ category, blogs, query, errorCode }) => {

    if (errorCode) {
        return (
            <Layout>
                <div style={{ background: "black" }}>
                    <br /><br /><br />
                    <div className={styles.page404}>404 Error! Category Not Found</div>
                    <section className={styles.item0000}> <br /> <Search /> <br /><br /><br /></section>
                </div>
            </Layout>
        );
    }


    const head = () => (
        <Head>
            <title>{`${category.name} - ${APP_NAME}`}</title>
            <meta name="description" content={`Best programming tutorials on ${category.name}`} />
            <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
            <meta property="og:title" content={`${category.name}| ${APP_NAME}`} />
            <meta name="robots" content="index, follow" />
            <meta property="og:description" content={`Best programming tutorials on ${category.name}`} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );

    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;
    // const totalPages = Math.ceil(blogs.length / blogsPerPage);



    const showAllBlogs = () => {
        const startIndex = (currentPage - 1) * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        return blogs.slice(startIndex, endIndex).map((blog, i) => (
            <article key={i} className={styles.box}>
                <Card blog={blog} />
            </article>
        ));
    };


    
    const renderPagination = () => {
        const pageLinks = [];
        const totalPages = Math.ceil(blogs.length / blogsPerPage);
    
        // show page numbers with format 1, 2, 3, 4 ... 50, 51
        if (totalPages <= 10) {
          for (let i = 1; i <= totalPages; i++) {
              pageLinks.push(
                  <li key={i} className={currentPage === i ? styles.activePage : ''}>
                      <button onClick={() => setCurrentPage(i)}>{i}</button>
                  </li>
              );
          }
        } else {
          let startPage = currentPage - 4;
          let endPage = currentPage + 5;
    
          if (startPage < 1) {
            endPage = endPage + (1 - startPage);
            startPage = 1;
          }
    
          if (endPage > totalPages) {
            endPage = totalPages;
            if (endPage > 10) {
              startPage = endPage - 9;
            }
          }
    
          for (let i = startPage; i <= endPage; i++) {
            pageLinks.push(
              <li key={i} className={currentPage === i ? styles.activePage : ''}>
                <button onClick={() => setCurrentPage(i)}>{i}</button>
              </li>
            );
          }
    
          if (endPage < totalPages) {
            pageLinks.push(
              <li key={totalPages} className={styles.pageLink}>
                ...
              </li>
            );
            pageLinks.push(
              <li key={totalPages + 1}>
                <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
              </li>
            );
          } else if (startPage > 1) {
            pageLinks.unshift(
              <li key={1} className={styles.pageLink}>
                ...
              </li>
            );
            pageLinks.unshift(
              <li key={0}>
                <button onClick={() => setCurrentPage(1)}>1</button>
              </li>
            );
          }
        }
    
        return (
          <ul className={styles.pagination}>
              <li>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> Prev </button>
              </li>
              {pageLinks}
              <li>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}> Next </button>                    
              </li>
          </ul>
        );
    };


    return (
        <>
            {head()}
            <Layout>
                <main className={styles.backImg}>
                    <div className={styles.mtop}></div>
                    <h1 style={{ textAlign: "center", color: "white" }}>{`${category.name}`}</h1>
                    <br />

                    {renderPagination()}
                    <div className={styles.grid}>{showAllBlogs()}</div>
                    <br /> <br />

                </main>
            </Layout>
        </>
    );
};




export async function getServerSideProps({ query, res }) {
  try {
      const data = await singleCategory(query.slug);
      if (data.category === null) {
          res.statusCode = 404;
          return { props: { errorCode: 404 } };
      }
      return { props: { category: data.category, blogs: data.blogs, query } };
  } catch (error) {
      console.error(error);
      return { props: { errorCode: 500 } };
  }
}


export default Category;