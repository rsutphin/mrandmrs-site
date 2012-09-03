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

end
