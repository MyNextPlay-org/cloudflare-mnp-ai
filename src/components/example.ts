import { html } from "@respond-run/html";

export default {
  name: "example",
  count: 0,

  increment() {
    this.count++;
  },

  render() {
    return html`
      <div x-data="${this.name}()" class="space-x-2">
        <button @click="increment()">+</button>
        <span x-text="count"></span>
        <form class="uk-form-stacked space-y-4">
          <div class="">
            <label
              class="uk-form-label uk-form-label-required"
              for="form-stacked-text"
            >
              Text
            </label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="form-stacked-text"
                type="text"
                placeholder="Some text"
              />
            </div>
          </div>

          <div class="">
            <label class="uk-form-label" for="form-stacked-select"
              >Select</label
            >
            <div class="uk-form-controls">
              <select class="uk-select" id="form-stacked-select">
                <option>Option 01</option>
                <option>Option 02</option>
              </select>
            </div>
          </div>

          <div class="">
            <div class="uk-form-label">Radio</div>
            <div class="uk-form-controls">
              <label class="mr-2">
                <input class="uk-radio mr-1" type="radio" name="radio1" />
                Option 01
              </label>
              <label>
                <input class="uk-radio mr-1" type="radio" name="radio1" />
                Option 02
              </label>
            </div>
          </div>

          <div class="h-10">
            <uk-input-date cls-custom="uk-input-fake"></uk-input-date>
          </div>
        </form>

        <div class="uk-chart-container max-w-md">
          <div class="p-4">
            <div class="uk-card-title">Area Chart - Smooth</div>
            <div class="uk-text-sm mt-2">January - June 2024</div>
          </div>

          <div class="px-4">
            <uk-chart>
              <script type="application/json">
                {
                  "series": [
                    {
                      "name": "Desktops",
                      "data": [186, 305, 237, 73, 209, 214]
                    }
                  ],
                  "chart": {
                    "type": "area",
                    "zoom": {
                      "enabled": false
                    },
                    "toolbar": {
                      "show": false
                    }
                  },
                  "dataLabels": {
                    "enabled": false
                  },
                  "stroke": {
                    "curve": "smooth",
                    "width": 2
                  },
                  "colors": ["hsl(var(--chart-1))"],
                  "grid": {
                    "row": {
                      "colors": []
                    },
                    "borderColor": "hsl(var(--border))"
                  },
                  "xaxis": {
                    "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    "tooltip": {
                      "enabled": false
                    },
                    "labels": {
                      "style": {
                        "colors": "hsl(var(--muted-foreground))"
                      }
                    },
                    "axisBorder": {
                      "show": false
                    },
                    "axisTicks": {
                      "show": false
                    }
                  },
                  "yaxis": {
                    "labels": {
                      "show": false
                    }
                  },
                  "tooltip": {
                    "title": {
                      "show": false
                    }
                  }
                }
              </script>
            </uk-chart>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-x-2 font-medium leading-none">
              Trending up by 5.2% this month
              <uk-icon icon="trending-up"></uk-icon>
            </div>
            <div class="text-muted-foreground mt-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
