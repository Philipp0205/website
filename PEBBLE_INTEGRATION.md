# Pebble Template Engine Integration Guide

## What is Pebble?

**Pebble** is a modern, lightweight Java template engine inspired by Twig (PHP) and Jinja2 (Python). It's designed for:
- **Performance**: Fast execution with minimal overhead
- **Security**: Auto-escaping by default to prevent XSS attacks
- **Simplicity**: Clean, readable syntax that's easy to learn
- **Power**: Template inheritance, macros, filters, functions, and more

### Key Features

1. **Clean Syntax**: More intuitive than Freemarker
2. **Template Inheritance**: Create base templates and extend them
3. **Auto-Escaping**: Safe by default
4. **Rich Filter Library**: Transform data easily (uppercase, date formatting, etc.)
5. **Custom Extensions**: Add your own filters and functions

## Integration Steps (Completed)

✅ **Step 1**: Added `template.engine=pebble` to `jbake.properties`

✅ **Step 2**: Created Pebble template files (`.peb` extension):
- `header.peb` - Page header
- `footer.peb` - Page footer
- `menu.peb` - Navigation menu
- `page.peb` - Static page template
- `index.peb` - Blog index template

## Syntax Comparison: Freemarker vs Pebble

### Variables
```freemarker
<!-- Freemarker -->
<#if (content.title)??>${content.title}<#else>Default</#if>
```

```pebble
{# Pebble #}
{{ content.title | default("Default") }}
```

### Conditionals
```freemarker
<!-- Freemarker -->
<#if (content.title)??>
  <h1>${content.title}</h1>
</#if>
```

```pebble
{# Pebble #}
{% if content.title is defined %}
  <h1>{{ content.title }}</h1>
{% endif %}
```

### Loops
```freemarker
<!-- Freemarker -->
<#list posts as post>
  <#if (post.status == "published")>
    ${post.title}
  </#if>
</#list>
```

```pebble
{# Pebble #}
{% for post in posts %}
  {% if post.status == "published" %}
    {{ post.title }}
  {% endif %}
{% endfor %}
```

### Includes
```freemarker
<!-- Freemarker -->
<#include "header.ftl">
```

```pebble
{# Pebble #}
{% include "header.peb" %}
```

## Pebble Syntax Overview

### 1. Variables
```pebble
{{ variable }}                    {# Output variable #}
{{ content.title }}              {# Access property #}
{{ content.title | upper }}      {# Apply filter #}
```

### 2. Filters (Transform Data)
```pebble
{{ content.title | upper }}                    {# UPPERCASE #}
{{ content.title | lower }}                    {# lowercase #}
{{ content.title | capitalize }}               {# Capitalize First Letter #}
{{ content.title | default("Untitled") }}      {# Default value #}
{{ content.date | date("dd MMMM yyyy") }}      {# Format date #}
{{ content.body | raw }}                       {# Don't escape HTML #}
{{ content.text | slice(0, 100) }}             {# Get substring #}
```

### 3. Control Structures
```pebble
{# If/Else #}
{% if condition %}
  ...
{% elseif othercondition %}
  ...
{% else %}
  ...
{% endif %}

{# For Loop #}
{% for item in items %}
  {{ item.name }}
{% endfor %}

{# Check if variable is defined #}
{% if variable is defined %}
  ...
{% endif %}

{# Check if variable is null #}
{% if variable is null %}
  ...
{% endif %}
```

### 4. Template Inheritance
```pebble
{# base.peb - Base template #}
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default Title{% endblock %}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>

{# child.peb - Extends base #}
{% extends "base.peb" %}

{% block title %}My Page Title{% endblock %}

{% block content %}
  <h1>My Content</h1>
{% endblock %}
```

### 5. Macros (Reusable Components)
```pebble
{# Define macro #}
{% macro button(text, url) %}
  <a href="{{ url }}" class="btn">{{ text }}</a>
{% endmacro %}

{# Use macro #}
{{ button("Click Me", "/page.html") }}
```

### 6. Comments
```pebble
{# This is a comment and won't be rendered #}
```

## Common Filters

- `upper` / `lower` - Change case
- `capitalize` / `title` - Capitalize first letter / Title Case
- `trim` - Remove whitespace
- `default("value")` - Provide default value
- `date("format")` - Format dates
- `raw` - Don't escape HTML (use with caution!)
- `escape` - HTML escape
- `length` - Get length of string/array
- `slice(start, end)` - Extract substring/subarray
- `replace("old", "new")` - Replace text
- `split("delimiter")` - Split string into array
- `join("delimiter")` - Join array into string
- `abs` - Absolute value
- `round` / `floor` / `ceil` - Round numbers

## Testing Your Templates

You can keep both Freemarker (`.ftl`) and Pebble (`.peb`) templates side-by-side for testing.

### To use Pebble templates:
Your `jbake.properties` is now set to: `template.engine=pebble`

### To switch back to Freemarker:
Change `jbake.properties` to: `template.engine=freemarker`

Or remove the line entirely (Freemarker is the default).

## Next Steps

1. **Test the templates**: Run JBake and verify the output
2. **Convert remaining templates**: Create `.peb` versions of:
   - `post.peb` (for blog posts)
   - `archive.peb` (for archive page)
   - `sitemap.peb` (for sitemap)
   - `feed.peb` (for RSS feed)
   - `tags.peb` (for tag pages)

3. **Leverage template inheritance**: Create a `base.peb` template that others extend
4. **Add custom macros**: Create reusable components for your site

## Resources

- **Pebble Documentation**: https://pebbletemplates.io/
- **JBake Documentation**: https://jbake.org/docs/2.6.7/#templates
- **Pebble GitHub**: https://github.com/PebbleTemplates/pebble

## Example: Advanced Template Inheritance

```pebble
{# templates/base.peb #}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>{% block title %}{{ content.title | default("My Website") }}{% endblock %}</title>
  {% block head %}
    <link href="{{ content.rootpath | default("") }}css/bootstrap.min.css" rel="stylesheet">
  {% endblock %}
</head>
<body>
  {% include "menu.peb" %}
  
  <div class="container">
    {% block content %}{% endblock %}
  </div>
  
  {% include "footer.peb" %}
</body>
</html>

{# templates/page.peb #}
{% extends "base.peb" %}

{% block content %}
  <h1>{{ content.title }}</h1>
  <p><em>{{ content.date | date("dd MMMM yyyy") }}</em></p>
  {{ content.body | raw }}
{% endblock %}
```

## Benefits of Using Pebble

1. **Cleaner Code**: Less verbose than Freemarker
2. **Better Security**: Auto-escaping prevents XSS by default
3. **Modern Syntax**: Similar to popular template engines (Twig, Jinja2)
4. **Better Error Messages**: More helpful debugging
5. **Active Development**: Well-maintained with regular updates

Enjoy your new Pebble templates! 🎉
