require 'date'

module SiteHelpers
  def page_title
    [
      'Kelly & Rhett',
      data.page.title,
      'May 18, 2013'
    ].compact.join(' | ')
  end

  def page_description
    data.page.description
  end

  def markdown_or(markdown_content, default_content=nil)
    if content = (markdown_content || default_content)
      markdown_renderer.render(content)
    end
  end

  def markdown_renderer
    @markdown_renderer ||= ::Redcarpet::Markdown.new(Redcarpet::Render::HTML)
  end

  def full_date(date_str)
    date = Date.parse(date_str) if date_str
    date.strftime('%A, %B %-d') if date
  end
end
