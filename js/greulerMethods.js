var instance1 = greuler({
	        target: '#greuler1',
	        height: 500,
	        animationTime: 500,
	        data: greuler.Graph.random({ connected: true })
	      }).update();
	      var instance2 = greuler({
		    target: '#greuler2',
		    width: 480,
		    height: 350,
		    data: {
		      linkDistance: 100,
		      nodes: [
		        {id: 0},
		        {id: 1},
		        {id: 2},
		        {id: 3},
		        {id: 4},
		        {id: 5}
		      ],
		      links: [
		        {source: 0, target: 1},
		        {source: 0, target: 2, directed: true},
		        {source: 0, target: 3},
		        {source: 1, target: 2, directed: true},
		        {source: 4, target: 0},
		        {source: 5, target: 0, directed: true},
		        {source: 4, target: 5}
		      ]
		    }
		  }).update();
		  var instance3 = instance2;
		  var instance3 = greuler({
		    target: '#greuler3',
		    directed: true,
		    width: 480,
		    height: 350,
		    data: {
		      nodes: [
		        {id: 0},
		        {id: 1},
		        {id: 2},
		        {id: 3},
		        {id: 4},
		        {id: 5}
		      ],
		      links: [
		        {source: 0, target: 1},
		        {source: 0, target: 2},
		        {source: 0, target: 3},
		        {source: 1, target: 2},
		        {source: 4, target: 0},
		        {source: 5, target: 0},
		        {source: 4, target: 5}
		      ]
		    }
		  }).update();
		  window.runGreuler1 = function () {
		    var player = window.generator = new greuler.player.Generator(instance1);
		    player.run(function *algorithm(instance1) {
		      var visited = [];

		      function *dfs(u, p) {
		        yield function () {
		          instance1.selector.highlightNode({ id: u });
		        };
		        visited[u] = true;

		        var adjacent = instance1.graph.getAdjacentNodes({ id: u });
		        for (var i = 0; i < adjacent.length; i += 1) {
		          var v = adjacent[i].id;

		          if (v === p) { continue; }

		          if (!visited[v]) {
		            yield function () {
		              instance1.selector.traverseAllEdgesBetween({ source: u, target: v });
		            };
		            yield *dfs(v, u);
		          } else {
		            yield function () {
		              instance1.selector.traverseAllEdgesBetween(
		                { source: u, target: v },
		                { keepStroke: false }
		              )
		                .transition()
		                .attr('opacity', 0.3);
		            };
		          }
		        }

		        yield function () {
		          instance1.selector.getNode({ id: u })
		            .transition()
		            .attr('fill', 'black');
		        };
		      }

		      yield *dfs(0, -1);
		    });
		  };
      window.addNode = function(){
        // let's keep this example simple and add a maximum of 10
        // nodes, this isn't related with the api btw, it's just to
        // avoid the creation of unnecessary nodes
        var id = -1;
        var nodes = [];
        var i;
        instance2.graph.nodes.forEach(function (node) {
          nodes[node.id] = true;
        });
        id = nodes.length;

        instance2.graph.addNode({ id: id });

        // after the structure of the graph has been changed it's
        // needed to trigger a new layout
        instance2.update();
      };
      window.removeNode = function(){
        var order = instance2.graph.nodes.length;
        var last = instance2.graph.nodes[order - 1];

        if (!last) {
          return;
        }

        // remove a node with an id < 10 if it exists in the graph
        // note that you can also call it with the node itself
        // e.g.
        //      instance2.graph.removeNode(last)
        //
        instance2.graph.removeNode({ id: last.id });

        // after the structure of the graph has been changed it's
        // needed to trigger a new layout
        instance2.update();
      };
      window.updateNode = function() {
        var order = instance2.graph.nodes.length;

        if (!order) { return; }

        var nodeIndex = Math.floor(Math.random() * order);
        var node = instance2.graph.nodes[nodeIndex];

        var update = instance2.graph.getNode({ id: node.id });
        update.label = '✓';
        update.topRightLabel = '∞';
        update.topLeftLabel = 'n';

        // note that this time the structure of the graph wasn't changed
        // only new properties were added to an existing node, therefore
        // we don't need to trigger a new layout
        instance2.update({ skipLayout: true });
      };
      window.addEdge = function() {
        var order = instance2.graph.nodes.length;
        var size = instance2.graph.edges.length;

        if (!order || size > 15) { return; }

        var uIndex = Math.floor(Math.random() * order);
        var vIndex = Math.floor(Math.random() * order);
        var u = instance2.graph.nodes[uIndex];
        var v = instance2.graph.nodes[vIndex];

        var edge = { source: u.id, target: v.id };
        // random edges have weight
        if (Math.random() > 0.5) {
          edge.weight = Math.floor(Math.random() * 5);
        }
        // random edges are directed
        Math.random() > 0.5 && (edge.directed = true);

        // Adding an edge to the graph between some existing nodes
        // in the graph
        instance2.graph.addEdge(edge);

        // after the structure of the graph has been changed it's
        // needed to trigger a new layout
        instance2.update();
      };
      window.removeEdge = function() {
        var size = instance2.graph.edges.length;
        var last = instance2.graph.edges[size - 1];

        if (!last) {
          return;
        }

        // remove a node with an id < 10 if it exists in the graph
        // note that you can also call it with the node itself
        // e.g.
        //      instance2.graph.removeNode(last)
        //
        instance2.graph.removeEdge({ id: last.id });

        // after the structure of the graph has been changed it's
        // needed to trigger a new layout
        instance2.update();
      };
      window.updateEdge = function(){
        var size = instance2.graph.edges.length;

        if (!size) { return; }

        var edgeIndex = Math.floor(Math.random() * size);
        var edge = instance2.graph.edges[edgeIndex];

        var update = instance2.graph.getEdge({ id: edge.id });
        update.weight = '∞';
        update.directed = !update.directed;

        // note that this time the structure of the graph wasn't changed
        // only new properties were changed in an existing edge, therefore
        // we don't need to trigger a new layout
        instance2.update({ skipLayout: true });
      };
      window.highlightRandom = function(){
        var order = instance3.graph.nodes.length;
		var size = instance3.graph.edges.length;

		var id = Math.floor(Math.random() * order);

		// highlight the node whose id is `id`, the highlight
		// animation is predefined but the user can easily define a
		// custom animation, the default animation works by modifying
		// the `r` attribute of the circle that represents the node
		instance3.selector.highlightNode({ id: id });

		// if we have the edge we can pass that object to the highlight edge method
		// however let's assume that we don't have it, we can pass the edge itself
		// and the selector will automatically get the d3 selection and perform the
		// highlight animation
		var edgeIndex = Math.floor(Math.random() * size);
		instance3.selector.highlightEdge(
		  instance3.graph.edges[edgeIndex]
		);
      };
      window.highlightIncident = function(){
		var order = instance3.graph.nodes.length;
		var id = Math.floor(Math.random() * order);
		instance3.selector.highlightNode({ id: id });

		// a utility method that changes the color of all the incident
		// edges of the node `id`
		instance3.selector.highlightIncidentEdges({ id: id });

		// highlight methods
		// - selector.highlightIncomingEdges
		// - selector.highlightOutgoingEdges
		// - selector.highlightIncidentEdges
      };
      window.highlightOutgoing = function(){
		var order = instance3.graph.nodes.length;
		var id = Math.floor(Math.random() * order);
		instance3.selector.highlightNode({ id: id });

		// a utility method that changes the color of all the incident
		// edges of the node `id`
		instance3.selector.highlightOutgoingEdges({ id: id });

		// highlight methods
		// - selector.highlightIncomingEdges
		// - selector.highlightOutgoingEdges
		// - selector.highlightIncidentEdges
      };
      window.highlightIncoming = function(){
		var order = instance3.graph.nodes.length;
		var id = Math.floor(Math.random() * order);
		instance3.selector.highlightNode({ id: id });

		// a utility method that changes the color of all the incident
		// edges of the node `id`
		instance3.selector.highlightIncomingEdges({ id: id });

		// highlight methods
		// - selector.highlightIncomingEdges
		// - selector.highlightOutgoingEdges
		// - selector.highlightIncidentEdges
      };
      window.highlightTraversing = function(){
      	var order = instance3.graph.nodes.length;
		var u = Math.floor(Math.random() * order);
		var v = Math.floor(Math.random() * order);

		instance3.selector.getEdges()
		  .attr('stroke', function (d) { return d.stroke; });

		instance3.selector.highlightNode({ id: u });
		instance3.selector.highlightNode({ id: v });
		instance3.selector.traverseAllEdgesBetween({
		  source: u,
		  target: v
		});
      };
      window.highlightCustomNode = function(){
		var order = instance3.graph.nodes.length;
		var id = Math.floor(Math.random() * order);

		// you can always create your custom transition if you want
		// here a random node is colored with a random color from
		// a predefined d3 palette
		instance3.selector.getNode({ id: id })
		  .transition('custom')
		  .duration(1000)
		  .attr('fill', greuler.colors.randomFromPalette());

		// check out `greuler.colors` for the palette
	  };
      window.highlightCustomEdge = function(){
		var size = instance3.graph.edges.length;
		var edgeIndex = Math.floor(Math.random() * size);
		var edge = instance3.graph.edges[edgeIndex];

		// you can always create your custom transition if you want
		// here a random node is colored with a random color from
		// a predefined d3 palette
		instance3.selector.getEdge({ id: edge.id })
		  .transition('custom')
		  .duration(1000)
		  .attr('stroke', greuler.colors.randomFromPalette());
	  };