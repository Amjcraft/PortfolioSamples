<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="xsl">
<xsl:output method="html" indent="yes"/>

<!-- This template is the "wrapper" or "container" for the custom view. -->
<xsl:template match="/">
	<xsl:variable name="Rows" select="/dsQueryResponse/NewDataSet/Row"/>
	<xsl:variable name="RowCount" select="count($Rows)"/>

	<xsl:choose>
		<xsl:when test="$RowCount &lt; 1">
			
		</xsl:when>
		<xsl:otherwise>
			<ul class="accordion" >
	   <!-- Jump to repeating content -->
				<xsl:apply-templates/>
			</ul>
			<div class="row table-icon-bar">
				<div class="col-sm-12 col-md-6">
					<span class="icon-bar-heading">Funding Options</span>
					<span class="icon-dhs-fema"><i class="fa fa-adn"></i> DHS/FEMA</span>
					<span class="icon-gi-bill"><i class="fa fa-graduation-cap"></i> Veterans Benefits</span>
					<span class="icon-gsa"><i class="fa fa-adjust"></i> GSA</span>
				</div> <!--col-md-6-->
				
				<div class="col-sm-12 col-md-6 text-right">
					<span class="icon-bar-heading">Delivery Types</span>
					<span class="icon-online-learning"><i class="fa fa-desktop"></i> Online</span>
					<span class="icon-f2f-learning"><i class="fa fa-book"></i> Face-to-Face</span>
					<span class="icon-blended-learning"><i class="fa fa-desktop"></i><i class="fa fa-plus"></i><i class="fa fa-book"></i> Blended</span>

				</div> <!--col-md-6-->
			</div>
	</xsl:otherwise>
</xsl:choose>
</xsl:template>
	
<!-- This template is for the repeating content -->
<xsl:template match="Row"> 
	<xsl:variable name="currentRow" select="position()"/>
	<xsl:variable name="members" select="../Row[$currentRow - 1][@CatID = current()/@CatID]"/>

	<xsl:choose>
		<xsl:when test="$members">
		</xsl:when>
		<xsl:otherwise> 
		
			<li id="accordion-id" rel="v:Subject" typeof="v:Subject"><h3 class="cat-name"  property="v:name"><xsl:value-of select="@CatName"/></h3>
				<ul class="sub-accordion" style="display:none;">
					<xsl:apply-templates select="../Row[@CatID = current()/@CatID]" mode="categoryGroup"/>
				</ul>
			</li>
		</xsl:otherwise>
	</xsl:choose>

</xsl:template>

 <xsl:template match="Row" mode="categoryGroup"> 
	<xsl:variable name="grantItems" select="translate(@GrantAssoc, ',', ' ')"/>
			<li rel="v:Course" typeof="v:Course">
			<div class="row">
				<div class="col-sm-12 col-md-1 btn-detail-toggle course-padding"><i class="fa fa-bars"></i> Details</div><!--col-md-2-->
				<div class="col-sm-12 col-md-7 btn-course-link course-padding">
					<a data-title="{@Course_Title}" data-course="{@Course_Number}" href="/Pages/Class.aspx?course={@Course_Number}&amp;courseTitle={@Course_Title}">
						<div class="col-sm-12 col-md-2 course-number" property="v:code"><xsl:value-of select="@Course_Number"/></div>
						<div class="col-sm-12 col-md-10 course-title" property="v:name"><xsl:value-of select="@Course_Title"/></div>
					</a>
				</div><!--col-md-2-->
				
					<div class="col-sm-6 col-md-2 course-padding"><div class="grant-items {$grantItems}">
						<i class="fa fa-adn icon-dhs-fema" title="DHS &amp; FEMA Funded"></i>
						<i class="fa fa-graduation-cap icon-gi-bill" title="G.I. Bill Funded"></i>
						<i class="fa fa-adjust icon-gsa" title="GSA Funded"></i>
					</div></div><!--col-md-2-->
				
				<div class="col-sm-6 col-md-2 course-padding"><div class="delivery-medthod {@DeliveryMethod}">
						<i class="fa fa-desktop icon-online-learning" title="Online Course"></i>
						<i class="fa fa-plus icon-blended-learning" title="Blended Course"></i>
						<i class="fa fa-book icon-f2f-learning" title="Face-to-Face Course"></i>
				</div></div><!--col-md-2-->
			</div><!-- Row -->	
			<div class="row course-details" style="display:none;">
				<div class="col-sm-12 col-md-7">
				<h4>Course Description</h4>
				<p class="course-description" property="v:description"><xsl:value-of disable-output-escaping="yes" select="@Description"/></p>
				<div class="btn btn-primary"><a href="/Pages/Class.aspx?course={@Course_Number}&amp;courseTitle={@Course_Title}">See full course information and schedule</a></div>
				</div>
				<div class="col-sm-12 col-md-4 col-md-offset-1">
				<h4>Contact Information</h4>
				<xsl:choose>
				<xsl:when test="@Email_Address = ''">
					<div class="first-name"><xsl:value-of select="@Name"/></div>
					<div class="primary-phone"><strong>Phone:</strong>&#160;<xsl:value-of select="@Phone"/></div>
					<div class="email-address"><strong>Email:</strong>&#160;<a href="mailto:{@EMail}"><xsl:value-of select="@EMail"/></a></div>
				</xsl:when>
				<xsl:otherwise>
					<div class="first-name"><xsl:value-of select="@FirstName"/>&#160;<xsl:value-of select="@LastName"/></div>
					<div class="contact-title"><xsl:value-of select="@ContactTitle"/></div>
					<div class="primary-phone"><strong>Phone:</strong>&#160;<xsl:value-of select="@Primary_phone"/></div>
					<div class="email-address"><strong>Email:</strong>&#160;<a href="mailto:{@Email_Address}"><xsl:value-of select="@Email_Address"/></a></div>
				</xsl:otherwise>
				</xsl:choose>
					
					
				</div><!--col-md-4-->
			</div><!-- Row -->
			</li>
			
</xsl:template>			



</xsl:stylesheet>