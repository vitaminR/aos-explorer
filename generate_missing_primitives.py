import json

# Load existing primitives for reference
with open("_primitives_inventory.json", "r") as f:
    existing = json.load(f)

# These are the 33 missing constructs, grouped by stratum
missing_by_stratum = {
    "S1": {
        "model_card": [
            "model_id",
            "version_tag",
            "license_type",
            "base_model_name",
            "training_dataset_id",
            "eval_metrics",
            "tokenizer_id",
            "config_hash",
        ],
        "model_endpoint": [
            "endpoint_url",
            "model_version",
            "load_balancer_id",
            "rate_limit_tokens_per_min",
            "concurrency_slots",
            "timeout_seconds",
            "authentication_key",
            "region",
        ],
        "context_window": [
            "max_tokens",
            "sliding_window_size",
            "rope_scaling_factor",
            "cache_layout_type",
            "kv_cache_quantization",
            "attention_mask_type",
        ],
        "tokenizer_config": [
            "vocab_size",
            "bos_token_id",
            "eos_token_id",
            "pad_token_id",
            "token_merge_strategy",
            "unicode_normalization",
        ],
        "inference_server": [
            "server_port",
            "framework_type",
            "device_type",
            "batch_strategy",
            "auto_scaling_enabled",
            "tpu_device_count",
        ],
        "gpu_pool": [
            "total_gpu_count",
            "gpu_model_type",
            "memory_gb_per_gpu",
            "interconnect_bandwidth",
            "power_limit_watts",
            "cooling_status",
        ],
        "batch_queue": [
            "queue_name",
            "max_batch_size",
            "wait_timeout_ms",
            "priority_level",
            "backpressure_threshold",
            "overflow_strategy",
        ],
        "autoscaler_policy": [
            "min_replicas",
            "max_replicas",
            "target_utilization_pct",
            "scale_up_threshold",
            "cooldown_period_sec",
            "metric_aggregation_window",
        ],
        "training_run": [
            "run_id",
            "dataset_version",
            "learning_rate",
            "batch_size",
            "num_epochs",
            "checkpoint_interval",
            "validation_split",
        ],
        "dataset_config": [
            "dataset_id",
            "split_ratios",
            "sequence_length",
            "sampling_strategy",
            "augmentation_enabled",
            "source_uri",
        ],
        "lora_adapter": [
            "adapter_rank",
            "adapter_alpha",
            "base_model_id",
            "weight_decay",
            "target_modules",
            "lora_dropout",
        ],
        "rlhf_pipeline": [
            "reward_model_id",
            "preference_data_source",
            "kl_penalty_beta",
            "num_ppo_epochs",
            "learning_rate",
            "update_frequency",
        ],
    },
    "S2": {
        "working_memory": [
            "capacity_tokens",
            "retention_policy",
            "eviction_strategy",
            "access_pattern_type",
            "compression_enabled",
        ],
        "episodic_store": [
            "store_id",
            "retention_days",
            "max_entries",
            "embedding_model_id",
            "indexing_frequency",
            "compression_ratio",
        ],
        "memory_consolidator": [
            "consolidation_interval_hours",
            "merge_strategy",
            "duplicate_threshold",
            "target_density",
            "gc_trigger_threshold",
        ],
        "forgetting_policy": [
            "decay_rate",
            "recency_weight",
            "access_frequency_weight",
            "semantic_similarity_threshold",
            "forgetting_curve_type",
        ],
        "entity_node": [
            "entity_id",
            "entity_type",
            "embedding_vector",
            "confidence_score",
            "created_timestamp",
            "last_updated",
        ],
        "relationship_edge": [
            "source_entity_id",
            "target_entity_id",
            "relationship_type",
            "strength_score",
            "temporal_validity",
            "metadata_json",
        ],
        "ontology_schema": [
            "ontology_id",
            "version",
            "root_concept",
            "hierarchy_depth",
            "relation_types",
            "extension_hooks",
        ],
        "graph_query": [
            "query_type",
            "traversal_depth",
            "result_limit",
            "filter_predicates",
            "scoring_function",
            "timeout_ms",
        ],
        "vector_index": [
            "index_type",
            "embedding_dimension",
            "distance_metric",
            "num_partitions",
            "vector_count",
            "index_size_mb",
        ],
        "embedding_model": [
            "embedding_id",
            "output_dimension",
            "distance_metric",
            "max_sequence_length",
            "normalization_type",
            "model_format",
        ],
        "chunk_strategy": [
            "chunk_size",
            "overlap_tokens",
            "splitting_method",
            "boundary_detection",
            "metadata_extraction",
            "encoding_format",
        ],
        "index_refresh": [
            "refresh_interval_seconds",
            "batch_size",
            "incremental_flag",
            "full_reindex_trigger",
            "concurrent_jobs",
            "cleanup_policy",
        ],
    },
    "S3": {
        "sandbox_runtime": [
            "runtime_id",
            "isolation_level",
            "resource_limits_json",
            "timeouts_json",
            "networking_enabled",
            "filesystem_access",
        ]
    },
    "S4": {
        "pattern": [
            "pattern_id",
            "pattern_type",
            "match_rules",
            "action_handler",
            "priority_level",
            "enabled_flag",
        ]
    },
    "S6-S7": {
        "harness": [
            "harness_id",
            "test_suite_id",
            "fixture_config",
            "teardown_script",
            "test_parallelism",
            "failure_mode",
        ],
        "persona": [
            "persona_id",
            "role_name",
            "capability_set",
            "training_data_source",
            "behavior_parameters",
            "knowledge_base_id",
        ],
        "stack": [
            "stack_id",
            "stratum_composition",
            "version_constraints",
            "dependency_graph",
            "deployment_target",
            "resource_manifest",
        ],
        "covenant": [
            "covenant_id",
            "obligation_set",
            "constraint_rules",
            "penalty_function",
            "renewal_period_days",
            "stakeholder_list",
        ],
        "policy_rule": [
            "rule_id",
            "condition_expression",
            "action_type",
            "effect",
            "priority",
            "audit_enabled",
        ],
        "override_protocol": [
            "override_id",
            "target_rule_id",
            "override_value",
            "expiration_timestamp",
            "approval_chain",
            "audit_trail",
        ],
        "trace_span": [
            "span_id",
            "parent_span_id",
            "operation_name",
            "start_timestamp",
            "duration_ms",
            "status_code",
            "attributes_json",
        ],
    },
}

# Flatten and create new primitives
new_primitives = []
primitive_id = len(existing) + 1

for stratum_set, constructs in missing_by_stratum.items():
    for construct_name, primitive_names in constructs.items():
        stratum = None
        if stratum_set == "S1":
            stratum = "S1"
        elif stratum_set == "S2":
            stratum = "S2"
        elif stratum_set == "S3":
            stratum = "S3"
        elif stratum_set == "S4":
            stratum = "S4"
        else:  # S6-S7
            stratum = "S6"  # Map to S6 for now

        for prim_name in primitive_names:
            new_primitives.append(
                {
                    "id": primitive_id,
                    "name": prim_name,
                    "stratum": stratum,
                    "parent": construct_name,
                    "description": f"{prim_name.replace('_', ' ').title()} parameter for {construct_name.replace('_', ' ')}",
                }
            )
            primitive_id += 1

# Show counts
print(f"New primitives to add: {len(new_primitives)}")
print()
print("Breakdown by stratum:")
strata = {}
for p in new_primitives:
    strata[p["stratum"]] = strata.get(p["stratum"], 0) + 1

for stratum in sorted(strata.keys()):
    print(f"  {stratum}: {strata[stratum]} primitives")

# Show sample
print()
print("Sample (first 5):")
for p in new_primitives[:5]:
    print(f"  - {p['name']} ({p['stratum']}) → {p['parent']}")

# Output JSON for inspection
print()
print("Sample JSON:")
print(json.dumps(new_primitives[:3], indent=2))
