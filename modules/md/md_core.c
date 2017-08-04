/* Copyright 2017 greenbytes GmbH (https://www.greenbytes.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <assert.h>
#include <stdlib.h>

#include <apr_lib.h>
#include <apr_strings.h>
#include <apr_tables.h>
#include <apr_time.h>
#include <apr_date.h>

#include "md_json.h"
#include "md.h"
#include "md_log.h"
#include "md_store.h"
#include "md_util.h"


int md_contains(const md_t *md, const char *domain)
{
   return md_array_str_index(md->domains, domain, 0, 0) >= 0;
}

const char *md_common_name(const md_t *md1, const md_t *md2)
{
    int i;
    
    if (md1 == NULL || md1->domains == NULL
        || md2 == NULL || md2->domains == NULL) {
        return NULL;
    }
    
    for (i = 0; i < md1->domains->nelts; ++i) {
        const char *name1 = APR_ARRAY_IDX(md1->domains, i, const char*);
        if (md_contains(md2, name1)) {
            return name1;
        }
    }
    return NULL;
}

int md_domains_overlap(const md_t *md1, const md_t *md2)
{
    return md_common_name(md1, md2) != NULL;
}

apr_size_t md_common_name_count(const md_t *md1, const md_t *md2)
{
    int i;
    apr_size_t hits;
    
    if (md1 == NULL || md1->domains == NULL
        || md2 == NULL || md2->domains == NULL) {
        return 0;
    }
    
    hits = 0;
    for (i = 0; i < md1->domains->nelts; ++i) {
        const char *name1 = APR_ARRAY_IDX(md1->domains, i, const char*);
        if (md_contains(md2, name1)) {
            ++hits;
        }
    }
    return hits;
}

md_t *md_create_empty(apr_pool_t *p)
{
    md_t *md = apr_pcalloc(p, sizeof(*md));
    if (md) {
        md->domains = apr_array_make(p, 5, sizeof(const char *));
        md->contacts = apr_array_make(p, 5, sizeof(const char *));
        md->drive_mode = MD_DRIVE_DEFAULT;
        md->defn_name = "unknown";
        md->defn_line_number = 0;
    }
    return md;
}

int md_equal_domains(const md_t *md1, const md_t *md2)
{
    int i;
    if (md1->domains->nelts == md2->domains->nelts) {
        for (i = 0; i < md1->domains->nelts; ++i) {
            const char *name1 = APR_ARRAY_IDX(md1->domains, i, const char*);
            if (!md_contains(md2, name1)) {
                return 0;
            }
        }
        return 1;
    }
    return 0;
}

int md_contains_domains(const md_t *md1, const md_t *md2)
{
    int i;
    if (md1->domains->nelts >= md2->domains->nelts) {
        for (i = 0; i < md2->domains->nelts; ++i) {
            const char *name2 = APR_ARRAY_IDX(md2->domains, i, const char*);
            if (!md_contains(md1, name2)) {
                return 0;
            }
        }
        return 1;
    }
    return 0;
}

md_t *md_find_closest_match(apr_array_header_t *mds, const md_t *md)
{
    md_t *candidate, *m;
    apr_size_t cand_n, n;
    int i;
    
    candidate = md_get_by_name(mds, md->name);
    if (!candidate) {
        /* try to find an instance that contains all domain names from md */ 
        for (i = 0; i < mds->nelts; ++i) {
            m = APR_ARRAY_IDX(mds, i, md_t *);
            if (md_contains_domains(m, md)) {
                return m;
            }
        }
        /* no matching name and no md in the list has all domains.
         * We consider that managed domain as closest match that contains at least one
         * domain name from md, ONLY if there is no other one that also has.
         */
        cand_n = 0;
        for (i = 0; i < mds->nelts; ++i) {
            m = APR_ARRAY_IDX(mds, i, md_t *);
            n = md_common_name_count(md, m);
            if (n > cand_n) {
                candidate = m;
                cand_n = n;
            }
        }
    }
    return candidate;
}

md_t *md_get_by_name(struct apr_array_header_t *mds, const char *name)
{
    int i;
    for (i = 0; i < mds->nelts; ++i) {
        md_t *md = APR_ARRAY_IDX(mds, i, md_t *);
        if (!strcmp(name, md->name)) {
            return md;
        }
    }
    return NULL;
}

md_t *md_get_by_domain(struct apr_array_header_t *mds, const char *domain)
{
    int i;
    for (i = 0; i < mds->nelts; ++i) {
        md_t *md = APR_ARRAY_IDX(mds, i, md_t *);
        if (md_contains(md, domain)) {
            return md;
        }
    }
    return NULL;
}

md_t *md_get_by_dns_overlap(struct apr_array_header_t *mds, const md_t *md)
{
    int i;
    for (i = 0; i < mds->nelts; ++i) {
        md_t *o = APR_ARRAY_IDX(mds, i, md_t *);
        if (strcmp(o->name, md->name) && md_common_name(o, md)) {
            return o;
        }
    }
    return NULL;
}

const char *md_create(md_t **pmd, apr_pool_t *p, apr_array_header_t *domains)
{
    md_t *md;
    
    if (domains->nelts <= 0) {
        return "needs at least one domain name";
    }
    
    md = md_create_empty(p);
    if (!md) {
        return "not enough memory";
    }

    md->domains = md_array_str_compact(p, domains, 0);
    md->name = APR_ARRAY_IDX(md->domains, 0, const char *);
    
    *pmd = md;
    return NULL;   
}

/**************************************************************************************************/
/* lifetime */

md_t *md_copy(apr_pool_t *p, const md_t *src)
{
    md_t *md;
    
    md = apr_pcalloc(p, sizeof(*md));
    if (md) {
        memcpy(md, src, sizeof(*md));
        md->domains = apr_array_copy(p, src->domains);
        md->contacts = apr_array_copy(p, src->contacts);
        if (src->ca_challenges) {
            md->ca_challenges = apr_array_copy(p, src->ca_challenges);
        }
    }    
    return md;   
}

md_t *md_clone(apr_pool_t *p, const md_t *src)
{
    md_t *md;
    
    md = apr_pcalloc(p, sizeof(*md));
    if (md) {
        md->state = src->state;
        md->name = apr_pstrdup(p, src->name);
        md->drive_mode = src->drive_mode;
        md->domains = md_array_str_compact(p, src->domains, 0);
        md->renew_window = src->renew_window;
        md->contacts = md_array_str_clone(p, src->contacts);
        if (src->ca_url) md->ca_url = apr_pstrdup(p, src->ca_url);
        if (src->ca_proto) md->ca_proto = apr_pstrdup(p, src->ca_proto);
        if (src->ca_account) md->ca_account = apr_pstrdup(p, src->ca_account);
        if (src->ca_agreement) md->ca_agreement = apr_pstrdup(p, src->ca_agreement);
        if (src->defn_name) md->defn_name = apr_pstrdup(p, src->defn_name);
        if (src->cert_url) md->cert_url = apr_pstrdup(p, src->cert_url);
        md->defn_line_number = src->defn_line_number;
        if (src->ca_challenges) {
            md->ca_challenges = md_array_str_clone(p, src->ca_challenges);
        }
    }    
    return md;   
}

/**************************************************************************************************/
/* format conversion */

md_json_t *md_to_json(const md_t *md, apr_pool_t *p)
{
    md_json_t *json = md_json_create(p);
    if (json) {
        apr_array_header_t *domains = md_array_str_compact(p, md->domains, 0);
        md_json_sets(md->name, json, MD_KEY_NAME, NULL);
        md_json_setsa(domains, json, MD_KEY_DOMAINS, NULL);
        md_json_setsa(md->contacts, json, MD_KEY_CONTACTS, NULL);
        md_json_sets(md->ca_account, json, MD_KEY_CA, MD_KEY_ACCOUNT, NULL);
        md_json_sets(md->ca_proto, json, MD_KEY_CA, MD_KEY_PROTO, NULL);
        md_json_sets(md->ca_url, json, MD_KEY_CA, MD_KEY_URL, NULL);
        md_json_sets(md->ca_agreement, json, MD_KEY_CA, MD_KEY_AGREEMENT, NULL);
        if (md->cert_url) {
            md_json_sets(md->cert_url, json, MD_KEY_CERT, MD_KEY_URL, NULL);
        }
        md_json_setl(md->state, json, MD_KEY_STATE, NULL);
        md_json_setl(md->drive_mode, json, MD_KEY_DRIVE_MODE, NULL);
        if (md->expires > 0) {
            char *ts = apr_pcalloc(p, APR_RFC822_DATE_LEN);
            apr_rfc822_date(ts, md->expires);
            md_json_sets(ts, json, MD_KEY_CERT, MD_KEY_EXPIRES, NULL);
        }
        md_json_setl(apr_time_sec(md->renew_window), json, MD_KEY_RENEW_WINDOW, NULL);
        if (md->ca_challenges && md->ca_challenges->nelts > 0) {
            apr_array_header_t *na;
            na = md_array_str_compact(p, md->ca_challenges, 0);
            md_json_setsa(na, json, MD_KEY_CA, MD_KEY_CHALLENGES, NULL);
        }
        return json;
    }
    return NULL;
}

md_t *md_from_json(md_json_t *json, apr_pool_t *p)
{
    const char *s;
    md_t *md = md_create_empty(p);
    if (md) {
        md->name = md_json_dups(p, json, MD_KEY_NAME, NULL);            
        md_json_dupsa(md->domains, p, json, MD_KEY_DOMAINS, NULL);
        md_json_dupsa(md->contacts, p, json, MD_KEY_CONTACTS, NULL);
        md->ca_account = md_json_dups(p, json, MD_KEY_CA, MD_KEY_ACCOUNT, NULL);
        md->ca_proto = md_json_dups(p, json, MD_KEY_CA, MD_KEY_PROTO, NULL);
        md->ca_url = md_json_dups(p, json, MD_KEY_CA, MD_KEY_URL, NULL);
        md->ca_agreement = md_json_dups(p, json, MD_KEY_CA, MD_KEY_AGREEMENT, NULL);
        md->cert_url = md_json_dups(p, json, MD_KEY_CERT, MD_KEY_URL, NULL);
        md->state = (int)md_json_getl(json, MD_KEY_STATE, NULL);
        md->drive_mode = (int)md_json_getl(json, MD_KEY_DRIVE_MODE, NULL);
        md->domains = md_array_str_compact(p, md->domains, 0);
        s = md_json_dups(p, json, MD_KEY_CERT, MD_KEY_EXPIRES, NULL);
        if (s && *s) {
            md->expires = apr_date_parse_rfc(s);
        }
        md->renew_window = apr_time_from_sec(md_json_getl(json, MD_KEY_RENEW_WINDOW, NULL));
        if (md_json_has_key(json, MD_KEY_CA, MD_KEY_CHALLENGES, NULL)) {
            md->ca_challenges = apr_array_make(p, 5, sizeof(const char*));
            md_json_dupsa(md->ca_challenges, p, json, MD_KEY_CA, MD_KEY_CHALLENGES, NULL);
        }
        return md;
    }
    return NULL;
}

