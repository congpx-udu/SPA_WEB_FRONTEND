import { Card, Rate, Pagination, Modal, Tag, Statistic, Button, Row, Col } from 'antd';
import { EyeOutlined, StarFilled } from '@ant-design/icons';
import { useModel } from 'umi';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import '../globals.css';

export function FeedbackPage() {
  const {
    filteredReviews,
    activeFilter,
    currentPage,
    selectedReview,
    stats,
    setCurrentPage,
    handleFilterChange,
    openReviewDetail,
    closeReviewDetail,
  } = useModel('landingPage.feedback');

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif', paddingTop: 80 }}
    >
      <Navbar />

      {/* Header Stats */}
      <section
        className="flex flex-col items-center gap-4 px-[120px] py-16"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <h1 className="text-[40px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Customer Feedback
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          Read honest reviews from our valued clients
        </p>
        <Row gutter={64} style={{ paddingTop: 24 }}>
          <Col>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Average Rating</span>}
              value={stats.averageRating}
              precision={1}
              valueStyle={{ color: 'var(--accent-deep)', fontWeight: 700, fontSize: 36 }}
            />
          </Col>
          <Col>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Total Reviews</span>}
              value={stats.totalReviews}
              valueStyle={{ color: 'var(--accent-deep)', fontWeight: 700, fontSize: 36 }}
              formatter={(val) => `${Number(val).toLocaleString()}`}
            />
          </Col>
          <Col>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Satisfaction</span>}
              value={stats.satisfaction}
              suffix="%"
              valueStyle={{ color: 'var(--accent-deep)', fontWeight: 700, fontSize: 36 }}
            />
          </Col>
        </Row>
      </section>

      {/* Filter Bar */}
      <div
        className="flex items-center gap-3 px-[120px]"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-light)',
          minHeight: 20,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', marginRight: 8 }}>
          Filter by:
        </span>
        <Tag
          onClick={() => handleFilterChange(null)}
          style={{
            cursor: 'pointer',
            borderRadius: 20,
            padding: '4px 16px',
            fontSize: 13,
            fontWeight: 500,
            color: activeFilter === null ? '#fff' : 'var(--text-primary)',
            backgroundColor: activeFilter === null ? 'var(--accent-deep)' : 'var(--bg-primary)',
            border: activeFilter === null ? 'none' : '1px solid var(--border-light)',
          }}
        >
          All
        </Tag>
        {[5, 4, 3, 2, 1].map((stars) => (
          <Tag
            key={stars}
            onClick={() => handleFilterChange(stars)}
            style={{
              cursor: 'pointer',
              borderRadius: 20,
              padding: '4px 16px',
              fontSize: 13,
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: activeFilter === stars ? '#fff' : 'var(--text-primary)',
              backgroundColor: activeFilter === stars ? 'var(--accent-deep)' : 'var(--bg-primary)',
              border: activeFilter === stars ? 'none' : '1px solid var(--border-light)',
            }}
          >
            <StarFilled style={{ color: activeFilter === stars ? '#fff' : 'var(--accent-deep)', fontSize: 14 }} />
            {stars === 1 ? '1 Star' : `${stars} Stars`}
          </Tag>
        ))}
      </div>

      {/* Review List */}
      <section className="flex flex-col items-center gap-4 px-[120px] py-12" style={{ marginTop: 8, paddingBottom: 64 }}>
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className="landing-card w-full"
            style={{ borderColor: 'var(--border-light)', borderRadius: 16 }}
            bodyStyle={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                <div className="flex flex-col gap-[3px]">
                  <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {review.name}
                  </span>
                  <Tag
                    style={{
                      borderRadius: 8,
                      fontSize: 12,
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-deep)',
                      border: 'none',
                      margin: 0,
                    }}
                  >
                    {review.service}
                  </Tag>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Rate disabled defaultValue={review.rating} style={{ color: 'var(--accent-deep)', fontSize: 16 }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {review.date}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {review.body}
            </p>

            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => openReviewDetail(review)}
              style={{ color: 'var(--accent-deep)', padding: 0, height: 'auto', fontWeight: 500, fontSize: 13, alignSelf: 'flex-start' }}
            >
              Read full review
            </Button>
          </Card>
        ))}

        <Pagination
          current={currentPage}
          total={100}
          pageSize={10}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          style={{ marginTop: 32 }}
        />
      </section>

      {/* Review Detail Modal */}
      <Modal
        visible={!!selectedReview}
        onCancel={closeReviewDetail}
        footer={null}
        title="Full Review"
        width={640}
        centered
        bodyStyle={{ padding: '24px 32px' }}
      >
        {selectedReview && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedReview.name}
                </span>
                <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  {selectedReview.email}
                </span>
              </div>
            </div>

            <Row gutter={24}>
              <Col>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Service</span>
                  <Tag style={{ borderRadius: 8, backgroundColor: 'var(--accent-light)', color: 'var(--accent-deep)', border: 'none' }}>
                    {selectedReview.service}
                  </Tag>
                </div>
              </Col>
              <Col>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Date</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selectedReview.date}</span>
                </div>
              </Col>
              {selectedReview.phone && (
                <Col>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Phone</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selectedReview.phone}</span>
                  </div>
                </Col>
              )}
            </Row>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Rating:</span>
              <Rate disabled defaultValue={selectedReview.rating} style={{ color: 'var(--accent-deep)', fontSize: 20 }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>
                {selectedReview.rating}.0
              </span>
            </div>

            <div className="h-px w-full" style={{ backgroundColor: 'var(--border-light)' }} />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Feedback</span>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {selectedReview.fullFeedback || selectedReview.body}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default FeedbackPage;
