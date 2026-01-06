# Pebble Quick Reference for JBake

## Basic Syntax

### Output Variables
```pebble
{{ variable }}
{{ object.property }}
{{ array[0] }}
```

### Comments
```pebble
{# This is a comment #}
```

### Control Structures

#### If Statement
```pebble
{% if condition %}
  ...
{% elseif other_condition %}
  ...
{% else %}
  ...
{% endif %}
```

#### For Loop
```pebble
{% for item in items %}
  {{ item }}
{% endfor %}
```

#### Set Variable
```pebble
{% set variable = "value" %}
```

### Include
```pebble
{% include "template.peb" %}
```

### Template Inheritance
```pebble
{% extends "base.peb" %}

{% block blockname %}
  content
{% endblock %}
```

## Common JBake Variables

- `{{ content.title }}` - Page/post title
- `{{ content.body }}` - Page/post body (HTML)
- `{{ content.date }}` - Publication date
- `{{ content.uri }}` - Relative URL
- `{{ content.rootpath }}` - Path to root
- `{{ content.status }}` - Publication status
- `{{ config.site_host }}` - Site host URL
- `{{ config.feed_file }}` - RSS feed filename
- `{{ posts }}` - List of all posts
- `{{ published_posts }}` - List of published posts
- `{{ tag }}` - Current tag (in tag pages)
- `{{ tag_posts }}` - Posts for current tag

## Useful Filters

### Text Filters
```pebble
{{ text | upper }}           {# UPPERCASE #}
{{ text | lower }}           {# lowercase #}
{{ text | capitalize }}      {# Capitalize first letter #}
{{ text | title }}           {# Title Case #}
{{ text | trim }}            {# Remove whitespace #}
{{ text | default("value") }} {# Default if null/undefined #}
```

### Date Filters
```pebble
{{ date | date("dd MMMM yyyy") }}          {# 04 January 2025 #}
{{ date | date("yyyy-MM-dd") }}            {# 2025-01-04 #}
{{ date | date("EEE, d MMM yyyy") }}       {# Sat, 4 Jan 2025 #}
```

### HTML Filters
```pebble
{{ html | raw }}             {# Don't escape HTML #}
{{ text | escape }}          {# Escape HTML entities #}
```

### String Manipulation
```pebble
{{ text | slice(0, 100) }}              {# Substring #}
{{ text | replace("old", "new") }}      {# Replace text #}
{{ text | split(",") }}                 {# Split into array #}
{{ array | join(", ") }}                {# Join array #}
```

### Tests
```pebble
{% if variable is defined %}...{% endif %}
{% if variable is null %}...{% endif %}
{% if variable is empty %}...{% endif %}
{% if variable is even %}...{% endif %}
{% if variable is odd %}...{% endif %}
```

## Example Templates

### Simple Page
```pebble
{% include "header.peb" %}
{% include "menu.peb" %}

<h1>{{ content.title }}</h1>
<p>{{ content.body | raw }}</p>

{% include "footer.peb" %}
```

### Blog Post with Date
```pebble
{% include "header.peb" %}
{% include "menu.peb" %}

<article>
  <h1>{{ content.title }}</h1>
  <time>{{ content.date | date("MMMM d, yyyy") }}</time>
  <div class="content">
    {{ content.body | raw }}
  </div>
</article>

{% include "footer.peb" %}
```

### Post List
```pebble
{% for post in published_posts %}
  <article>
    <h2><a href="{{ post.uri }}">{{ post.title }}</a></h2>
    <time>{{ post.date | date("MMMM d, yyyy") }}</time>
    <p>{{ post.body | slice(0, 200) | raw }}...</p>
  </article>
{% endfor %}
```

## Migration Tips

### Freemarker → Pebble

| Freemarker | Pebble |
|------------|--------|
| `${variable}` | `{{ variable }}` |
| `<#if condition>` | `{% if condition %}` |
| `</#if>` | `{% endif %}` |
| `<#list items as item>` | `{% for item in items %}` |
| `</#list>` | `{% endfor %}` |
| `<#include "file.ftl">` | `{% include "file.peb" %}` |
| `variable??` | `variable is defined` |
| `variable?string("format")` | `variable \| date("format")` |
| `variable?upper_case` | `variable \| upper` |
| `variable!default` | `variable \| default("default")` |

## More Information

- Full documentation: https://pebbletemplates.io/wiki/guide/basic-usage/
- JBake docs: https://jbake.org/docs/
