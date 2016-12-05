using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;

namespace DT.Filters {
    public class NoCacheAttribute : ActionFilterAttribute {
        public override void OnResultExecuted(ResultExecutedContext filterContext) {
     
        HttpCachePolicyBase cache = filterContext.HttpContext.Response.Cache;
            cache.SetCacheability(HttpCacheability.NoCache);

            base.OnResultExecuted(filterContext);
        }
    }
}