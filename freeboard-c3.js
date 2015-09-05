(function() {

    freeboard.loadWidgetPlugin({
        "type_name": "C3",
        "display_name": "C3 Widget",
        "description": "Very simple and basic wrapper around C3, which is a wrapper around D3 for each reusable graphs.",
        "external_scripts": [
            "http://rawgit.com/mbostock/d3/master/d3.js",
            "https://rawgit.com/masayuki0812/c3/master/c3.js"
        ],
        "fill_size": true,
        "settings": [{
            "name": "id",
            "display_name": "Char id"
        }, {
            "name": "type",
            "display_name": "Type",
            "type": "option",
            "options": [{
                "name": "Line",
                "value": "line"
            }, {
                "name": "Spline",
                "value": "spline"
            }, {
                "name": "Area",
                "value": "area"
            }, {
                "name": "Area-Spline",
                "value": "area-spline"
            }, {
                "name": "Step",
                "value": "step"
            }, {
                "name": "Area-Step",
                "value": "area-step"
            }, {
                "name": "Gauge",
                "value": "gauge"
            }, {
                "name": "Bar",
                "value": "bar"
            }, {
                "name": "Scatter",
                "value": "scatter"
            }, {
                "name": "Pie",
                "value": "pie"
            }, {
                "name": "Donut",
                "value": "donut"
            }]
        }, {
            "name": "columns",
            "display_name": "Chart columns",
            "type": "calculated",
            "description": "The columns to plot"
        }, {
            "name": "options",
            "display_name": "Chart Options",
            "type": "calculated",
            "description": "Extra options for rendering"
        }, {
            "name": "height",
            "display_name": "Height Blocks",
            "type": "number",
            "default_value": 5,
            "description": "A height block is around 60 pixels"
        }],
        newInstance: function(settings, newInstanceCallback) {
            newInstanceCallback(new freeboardC3Widget(settings));
        }

    });

    var freeboardC3Widget = function(settings) {
        var self = this;
        var currentSettings = settings;
        var chart = null;
        var myElement = $('<div class="testing"></div>');
        var padding = {
            right: 0
        };

        if (currentSettings.type !== "gauge" &&
            currentSettings.type !== "pie" &&
            currentSettings.type !== "donut") {
            padding.right = 8;
        } else {
            padding.right = 0;
        }

        self.render = function(containerElement) {
            $(containerElement).append(myElement);

            var options = {
                bindto: d3.selectAll(myElement.toArray()),
                data: {
                    columns: eval(currentSettings.columns),
                    type: currentSettings.type
                },
                padding: padding,
                size: {
                    height: currentSettings.height * 60
                }
            };

            $.extend(options, eval(settings.options));

            chart = c3.generate(options);
        }

        self.getHeight = function() {
            return currentSettings.height || 5;
        }

        self.onSettingsChanged = function(newSettings) {

            if (newSettings.type !== "gauge" &&
                newSettings.type !== "pie" &&
                newSettings.type !== "donut") {
                padding.right = 8;
            } else {
                padding.right = 0;
            }

            var options = {
                bindto: d3.selectAll(myElement.toArray()),
                data: {
                    columns: eval(newSettings.columns),
                    type: newSettings.type
                },
                padding: padding,
                size: {
                    height: newSettings.height * 60
                }
            };
            $.extend(options, eval(settings.options));

            chart = c3.generate(options);

            console.log(chart.data.colors());
            console.log(chart.data.axes());

            currentSettings = newSettings;
        }

        self.onCalculatedValueChanged = function(settingName, newValue) {

            if (settingName === "type") {
                chart.transform(newValue);
            } else if (settingName === "columns") {
                chart.load(eval(newValue));
            }
        }

        self.onDispose = function() {

        }

    }

}());
